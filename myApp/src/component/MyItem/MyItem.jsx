import { Component } from 'react'
import { AtIcon, AtDivider, AtToast } from 'taro-ui'
import Taro from "@tarojs/taro"

import { View } from '@tarojs/components'

import keLi from '../../assets/images/keli.png'

import './MyItem.scss'

const option = {
    duration: 60000,
    sampleRate: 16000, // 采样率（pc不支持）
    numberOfChannels: 1, // 录音通道数
    // encodeBitRate: 48000, // 编码码率(默认就是48000)
    frameSize: 1, // 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3、pcm 格式。
    format: "mp3", // 音频格式，默认是 aac
}

const recorderManager = Taro.getRecorderManager()

class myInfoComponent extends Component{
    constructor(props) {
        super(props)
        this.state = {
            isRecord: false,
            open: false,
        }
    }

    startRecord = () => {
        this.setState({
            open: true,
        })
        recorderManager.start(option);
        recorderManager.onStart()
        recorderManager.onStop((res) => {
            console.log('recorder stop', res)
            const tempFilePath = res.tempFilePath
            console.log(tempFilePath)
            Taro.playVoice({
                filePath: tempFilePath,
                complete: function () { }
            })
            Taro.uploadFile({
            url: 'https://xiaomiao.website/upload',
            filePath:tempFilePath,
            name:'speechFile',
            success:(uploadFileRes)=>{
                console.log("上传成功",uploadFileRes)
                if(uploadFileRes.statusCode===200){
                    this.play(uploadFileRes.data)
                }
            }
            })
        })

        recorderManager.onFrameRecorded((res) => {
            const { frameBuffer } = res
            console.log('frameBuffer.byteLength', frameBuffer.byteLength)
          })
    }

    endRecord = () => {
        this.setState({
            open: false,
        })
        console.log('end')
        recorderManager.stop()
    }

    play = (fileName) => {
        const innerAudioContext = Taro.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = 'https://xiaomiao.website/requestMp3/' + fileName
        innerAudioContext.onPlay(() => {
            console.log('开始播放')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
            
    }

    render(){
        const { isRecord, open } = this.state
        console.log(isRecord==true)
        return(
            <View>
                <View className='placeHolder'></View>

                <View className='record'>
                    <View className='container' onTouchStart={this.startRecord} onTouchEnd={this.endRecord}>
                        <AtIcon className='mic' prefixClass='icon' value='mic_circle' size='120' color='green'/>
                    </View>
                </View>
                
                <View className='start'>长按开始录音</View>

                <AtToast isOpened={open} text='正在录音' image={keLi} duration={0}></AtToast>

                <AtDivider className='version' content='版本号 V1.0.0' fontColor='black' />
            </View>
        )
    }
}

export default myInfoComponent
