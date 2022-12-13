import { Component } from "react"
import Taro from "@tarojs/taro"
import { View, Button, Image } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

import MyItem from '../../component/MyItem/MyItem'

import MyBackgroundItem from '../../component/MyBackgroundItem/MyBackgroundItem'

import indexBackground from '../../assets/images/index_bg_1.png'

import "./me.scss"

// 异步编程
// 1. 回调函数, success, fail等
// 2. promise, then, catch
// 3. async, await

class Me extends Component{

    constructor(props) {
        super(props)
        this.state = {
            needAuth : false,    //是否需要显示授权
            openModal : false,   //是否打开授权modal
            avatarUrl : '',      //头像图片地址
        }
    }

    componentWillMount () { }

    async componentDidMount () {
        try{
            // 获取登录信息
            // const loginRes = await Taro.login({})
            // if (loginRes.code){
            //     console.log(loginRes.code)
            // }
            // 处理服务端用户验证


            // 处理完成
            try{
                const res = await Taro.getSetting({})
                if(!res.authSetting['scope.userInfo']){
                    //提示需要授权
                    this.setState({
                        needAuth : true,
                        openModal : true,
                    })
                }
                if(res.authSetting['scope.userInfo']===true){
                    // eslint-disable-next-line no-shadow
                    Taro.getUserInfo({}).then(user => {
                        //   var userInfo = res.userInfo
                        //   var nickName = userInfo.nickName
                        //   var avatarUrl = userInfo.avatarUrl
                        //   var gender = userInfo.gender //性别 0：未知、1：男、2：女
                        //   var province = userInfo.province
                        //   var city = userInfo.city
                        //   var country = userInfo.country
                        this.setState({
                            avatarUrl : user.userInfo.avatarUrl,
                            openModal : false,
                            needAuth : false
                        })
                        console.log(user) 
                    })
                }
            }catch(error){
                console.log("error in getSetting : ", error)
            }
        }catch(err){
            console.log("error in login : ", err)

        }

    }
  
    componentWillUnmount () { }
  
    componentDidShow () { }
  
    componentDidHide () { }

    handelOpenModal = () => {
        this.setState({
            openModal : true
        })
    }

    handelCloseModal = () => {
        this.setState({
            openModal : false
        })
    }

    bindUserInfo = (e) => {
        console.log(e.detail)
        if(e.detail.userInfo){
            this.setState({
                avatarUrl : e.detail.userInfo.avatarUrl,
                openModal : false,
                needAuth : false
            })
            //   var userInfo = res.userInfo
            //   var nickName = userInfo.nickName
            //   var avatarUrl = userInfo.avatarUrl
            //   var gender = userInfo.gender //性别 0：未知、1：男、2：女
            //   var province = userInfo.province
            //   var city = userInfo.city
            //   var country = userInfo.country
        }else{
        }
    }

    render() {
    const { needAuth, openModal, avatarUrl } = this.state
    return (
      <View className='me'>
        {/* 页面整体背景 */}
        <Image className='bg_image' mode='scaleToFill' src={indexBackground} />
        {/* 登录头像背景 */}
        <MyBackgroundItem needAuth={needAuth} avatarUrl={avatarUrl} openModal={this.handelOpenModal}></MyBackgroundItem>
        {/* 个人信息等 */}
        <MyItem className='myInfo'></MyItem>
        
        {/* 授权模块 */}
        <AtModal isOpened={openModal}>
          <AtModalHeader>授权提醒</AtModalHeader>
          <AtModalContent>
            将获取你的昵称、头像、地区
          </AtModalContent>
          <AtModalAction> <Button onClick={this.handelCloseModal}>取消</Button> <Button open-type='getUserInfo' onGetUserInfo={this.bindUserInfo}>授权</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default Me
