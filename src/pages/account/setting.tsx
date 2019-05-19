import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtMessage, AtButton, AtModal } from 'taro-ui'

import { IAccount } from '../../interfaces/account'
import { initCredential, logout, logoutSuccess, logoutError } from '../../actions/account'

import './setting.scss'

type PageStateProps = {
  auth: boolean,
  account: IAccount,
}

type PageDispatchProps = {
  initCredential: () => void,
  logout: () => void,
  logoutSuccess: () => void,
  logoutError: () => void
}

type PageOwnProps = {}

type PageState = {
  size: number,
  logoutConfirmModal: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Setting {
  props: IProps;
}

@connect(({ account }) => ({
  auth: account.auth,
  account: account.account
}), (dispatch) => ({
  initCredential() {
    dispatch(initCredential())
  },
  logout() {
    dispatch(logout())
  },
  logoutSuccess() {
    dispatch(logoutSuccess())
  },
  logoutError() {
    dispatch(logoutError())
  }
}))
class Setting extends Component {
  config: Config = {
    navigationBarTitleText: '设置'
  }

  state = {
    size: 0,
    logoutConfirmModal: false
  }

  componentDidMount() {
    Taro.getStorageInfo({
      success: (res) => {
        if (!res.keys.includes('history')) {
          this.setState({
            size: 0
          })
        } else {
          this.setState({
            size: res.currentSize
          })
        }
      }
    })

    this.props.initCredential()
  }

  clearHistory() {
    Taro.removeStorage({
      key: 'history'
    }).then(() => {
      this.setState({
        size: 0
      })
    })
  }

  logout() {
    this.setState({
      logoutConfirmModal: true
    })
  }

  closeLogoutModal() {
    this.setState({
      logoutConfirmModal: false
    })
  }

  closeLogoutModalConfirm() {
    this.setState({
      logoutConfirmModal: false
    })
    this.doLogout()
  }

  doLogout() {
    const { account } = this.props
    this.props.logout()
    Taro.showLoading({
      title: '正在登出 💦'
    })
    Taro.request({
      url: 'https://vnext.steamcn.com/v1/auth/logout',
      data: {},
      header: {
        authorization: account.accessToken
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text'
    }).then(res => {
      if (res.statusCode === 200 || res.statusCode === 401) {
        this.props.logoutSuccess()
        Taro.hideLoading()
        Taro.atMessage({
          message: '已退出登录ヾ(•ω•`)o',
          type: 'success',
          duration: 2000
        })
      } else {
        this.props.logoutError()
        const data = res.data.message
        Taro.hideLoading()
        Taro.atMessage({
          message: `登出失败😱，${data}`,
          type: 'error',
          duration: 3000
        })
      }
    }, () => {
      this.props.logoutError()
      Taro.hideLoading()
      Taro.atMessage({
        message: '网络连接中断😭',
        type: 'error',
        duration: 2000
      })
    })
  }

  render() {
    const { auth } = this.props
    const {
      size,
      logoutConfirmModal
    } = this.state
    return (
      <View>
        <AtMessage />
        <View className='container'>
          <AtList>
            <AtListItem title='清除历史' extraText={`${size} KB`} onClick={this.clearHistory} />
          </AtList>
        </View>

        {auth &&
          <AtButton
            className='logout'
            type='secondary'
            onClick={this.logout}
          >退出登录 ヾ(•ω•`)o</AtButton>}

        <AtModal
          isOpened={logoutConfirmModal}
          cancelText='点错啦 QAQ'
          confirmText='不渴望了'
          content='少年，你真的不渴望抛瓦么？'
          onClose={this.closeLogoutModal.bind(this)}
          onCancel={this.closeLogoutModal.bind(this)}
          onConfirm={this.closeLogoutModalConfirm.bind(this)}
        />
      </View>
    )
  }
}

export default Setting as ComponentClass<PageOwnProps, PageState>
