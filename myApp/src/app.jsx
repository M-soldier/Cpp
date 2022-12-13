import { Component } from 'react'
import { Provider } from 'mobx-react'

import './app.scss'
import './iconfont.scss'


class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}
   

  // this.props.children 就是要渲染的页面
  render () {
    return (
      <Provider> 
        {this.props.children}
      </Provider>
    )
  }
}

export default App
