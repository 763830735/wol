const dgram=require('dgram')
const getData=require('./getFromXlsx')

function sendWOLPacket(macAddress, broadcastAddress) {
    // 创建一个UDP套接字
    const wolSocket = dgram.createSocket('udp4');
    
    // 构造唤醒包
    const preamble = Buffer.alloc(6, 'FF', 'hex');
    const syncStream = Buffer.concat(Array(16).fill(macAddress));
    const wakeOnLANPacket = Buffer.concat([preamble, syncStream]);
    
    // 发送唤醒包到广播地址
    wolSocket.send(wakeOnLANPacket, 0, wakeOnLANPacket.length, 9, broadcastAddress, (err) => {
        if (err) {
            console.error('Error sending WOL packet:', err);
        } else {
            console.log('WOL packet sent successfully.');
        }
        // 关闭套接字
        wolSocket.close();
    });
}

// // 目标计算机的MAC地址（十六进制格式）
// const macAddress = Buffer.from([0xe0, 0x73, 0xe7, 0xb8, 0x8c, 0x14]);
// // 局域网的广播地址
// const broadcastAddress = '192.168.31.21';
async function send(){
    const data = await getData();
    if(data===null)
        return
    let ip,className,mac;
    [className,ip,mac]= data
    for (let i=0;i<className.length;++i){
        console.log(className[i],ip[i],mac[i])
        // 发送唤醒包
        sendWOLPacket(mac[i], ip[i]);
    }
}

send()