import { Component } from "react";
import { View, Image } from '@tarojs/components'

import loginBg from '../../assets/images/login_bg.jpg'

import './MyBackgroundItem.scss'

class backgroundComponent extends Component{
    
    render(){
        const { needAuth, avatarUrl, openModal } = this.props
        return(
            <View className='login-bg'>
                <Image className='login-bg-cover' src={loginBg} />
                {
                    needAuth
                    ? <View className='click-login' onClick={openModal}>点击登录</View>
                    : <View className='user-avatar'>
                        <Image className='user-image' src={avatarUrl} />
                    </View>
                }
            </View>
        )
    }
}

export default backgroundComponent