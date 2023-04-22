/*
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-10 14:25:53
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-21 09:07:18
 * @FilePath: \ace-firefly\src\api\http\config.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export const CURRENT_CONFIG = {
  // license
  appId: '131091', // You need to go to the development website to apply.
  appKey: '3db9679d992f1e422025ea32446f703', // You need to go to the development website to apply.
  appLicense:
    'Ji9GxnEraiVDyTVtzST+E+hhbCZ0/jU2eYuM9Vq0tINLJ4jGVJH3oRaIrV2CwNfadpRxmY7qoeZ4rxi+bNNVwAy0v6TKsx14Ff9/FBtSr0qZ7kP5EdfI55gMbI9mKhc8XqMfqeVwegBqlCW/+jdJRlhzKWcvLLZmra9TYoYtZio=', // You need to go to the development website to apply.

  // http
  baseURL: 'http://47.104.134.41:6789/', // This url must end with "/". Example: 'http://192.168.1.1:6789/'
  websocketURL: 'ws://47.104.134.41:6789/api/v1/ws', // Example: 'ws://192.168.1.1:6789/api/v1/ws'

  // livestreaming
  // RTMP  Note: This IP is the address of the streaming server. If you want to see livestream on web page, you need to convert the RTMP stream to WebRTC stream.
  rtmpURL: 'rtmp://47.104.134.41/live/', // Example: 'rtmp://192.168.1.1/live/'
  // rtmpURL: 'rtmp://192.168.1.15/live/', // Example: 'rtmp://192.168.1.1/live/'

  // GB28181 Note:If you don't know what these parameters mean, you can go to Pilot2 and select the GB28181 page in the cloud platform. Where the parameters same as these parameters.
  gbServerIp: 'Please enter the server ip.',
  gbServerPort: 'Please enter the server port.',
  gbServerId: 'Please enter the server id.',
  gbAgentId: 'Please enter the agent id',
  gbPassword: 'Please enter the agent password',
  gbAgentPort: 'Please enter the local port.',
  gbAgentChannel: 'Please enter the channel.',
  // RTSP
  rtspUserName: 'Please enter the username.',
  rtspPassword: 'Please enter the password.',
  rtspPort: '8554',
  // Agora
  agoraAPPID: 'Please enter the agora app id.',
  agoraToken: 'Please enter the agora temporary token.',
  agoraChannel: 'Please enter the agora channel.',

  // map
  // You can apply on the AMap website.
  amapKey: 'e65f644e834d3b5da27ee2f51feffce0'
}
