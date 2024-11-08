/**
 * 今日诗词V2 JS-SDK 1.2.2
 * 今日诗词API 是一个可以免费调用的诗词接口：https://www.jinrishici.com
 */
!function (e) {
    var  t = {};
    function r(e, n) {
        var t = new XMLHttpRequest();
        t.open("get", n);
        // t.withCredentials = false
        // t.withCredentials = !0
        t.send();
        t.onreadystatechange = function (n) {
            if (4 === t.readyState || 3 === t.readyState || 2 === t.readyState) {
                var o = JSON.parse(t.responseText);
                '1' === o.status ? e(o) : console.error("高德地理位置API加载失败，错误原因：" + o.errMessage)
            }
        }
    }

    const getIPs = (callback) => {
        var ip_dups = {};
        var RTCPeerConnection = window.RTCPeerConnection
            || window.mozRTCPeerConnection
            || window.webkitRTCPeerConnection;
        var useWebKit = !!window.webkitRTCPeerConnection;
        var mediaConstraints = {
            optional: [{ RtpDataChannels: true }]
        };
        // 这里就是需要的ICEServer了
        var servers = {
            iceServers: [
                { urls: "stun:stun.services.mozilla.com" },
                { urls: "stun:stun.l.google.com:19302" },
            ]
        };
        var pc = new RTCPeerConnection(servers, mediaConstraints);
        function handleCandidate(candidate) {
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            var hasIp = ip_regex.exec(candidate)
            if (hasIp) {
                var ip_addr = ip_regex.exec(candidate)[1];
                if (ip_dups[ip_addr] === undefined)
                    callback(ip_addr);
                ip_dups[ip_addr] = true;
            }
        }
        // 网络协商的过程
        pc.onicecandidate = function (ice) {
            if (ice.candidate) {
                handleCandidate(ice.candidate.candidate);
            }
        };
        pc.createDataChannel("");
        //创建一个SDP(session description protocol)会话描述协议 是一个纯文本信息 包含了媒体和网络协商的信息
        pc.createOffer(function (result) {
            pc.setLocalDescription(result, function () { }, function () { });
        }, function () { });
        // setTimeout(function () {
        //     var lines = pc.localDescription.sdp.split('\n');
        //     lines.forEach(function (line) {
        //         if (line.indexOf('a=candidate:') === 0)
        //             handleCandidate(line);
        //     });
        // }, 1000);
    }

    t.load = function (n) {
        let ipstr=localStorage.getItem("ip")
        if (ipstr===null){
            getIPs((userip) => {
                localStorage.setItem("ip",userip.split(" ")[0])
            });
        }
        localStorage.removeItem("ip")
        if (ipstr!==null){
            ipstr.search(":")===-1? ipstr:ipstr=""
            return ipstr===""?"":r(n, `https://restapi.amap.com/v3/ip?key=${encodeURIComponent("37d0d1b0adb57a6c9ff5cd1744ef6023")}&ip=${encodeURIComponent(ipstr)}`)
        }else{
            return ""
        }

    };
        e.diliweizhi = t
}(window);
