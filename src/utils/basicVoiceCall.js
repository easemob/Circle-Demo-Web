import AgoraRTC from "agora-rtc-sdk-ng"
import store from "../store";
const { dispatch, getState } = store;
let rtc = {
    localAudioTrack: null,
    client: null
};

let options = {
    // Pass your App ID here.
    appId: "Your App ID",
    // Set the channel name.
    channel: "test",
    // Pass your temp token here.
    token: "Your temp token",
    // Set the user ID.
    uid: 123456
};

async function startBasicCall({ accessToken, channel, agoraUid }) {
    // Create an AgoraRTCClient object.
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8", role: "host" });
    rtc.client.enableAudioVolumeIndicator();

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    rtc.client.on("user-published", async (user, mediaType) => {
        console.log("==== user-published:", user.uid)
        //update user enabled
        const rtcUserInfo = { ...getState().rtc.rtcUserInfo };
        for (const key in rtcUserInfo) {
            if (Number(rtcUserInfo[key].agoraUid) === user.uid) {
                rtcUserInfo[key].enabled = true;
            }
        }
        dispatch.rtc.setRtcUserInfo(rtcUserInfo)
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        rtc.client.on("user-unpublished", async (user) => {
            const rtcUserInfo = { ...getState().rtc.rtcUserInfo };

            for (const key in rtcUserInfo) {
                if (Number(rtcUserInfo[key].agoraUid) === user.uid) {
                    rtcUserInfo[key].enabled = false;
                }
            }
            dispatch.rtc.setRtcUserInfo(rtcUserInfo)
            // Unsubscribe from the tracks of the remote user.
            await rtc.client.unsubscribe(user);
        });
    });
    //Listen for the user volume
    rtc.client.on("volume-indicator", function (result) {
        const rtcUserInfo = { ...getState().rtc.rtcUserInfo };
        result.forEach(function (volume, index) {
            for (const key in rtcUserInfo) {
                if (Number(rtcUserInfo[key].agoraUid) === volume.uid) {
                    rtcUserInfo[key].volume = volume.level;
                }
            }
        });
        dispatch.rtc.setRtcUserInfo(rtcUserInfo)
    });

    // Join an RTC channel.
    await rtc.client.join(options.appId, channel, accessToken, Number(agoraUid))
    // Create a local audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Publish the local audio tracks to the RTC channel.
    await rtc.client.publish([rtc.localAudioTrack]);
    console.log("====publish success!");
}

async function endBasicCall() {
    // Destroy the local audio track.
    rtc.localAudioTrack.close();
    // Leave the channel.
    await rtc.client.leave();
    console.log("====leave success!");
}

export {
    rtc,
    startBasicCall,
    endBasicCall,
}