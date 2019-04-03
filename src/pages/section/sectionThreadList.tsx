import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { IThreadMeta } from '../../interfaces/thread'
import ThreadCard from '../../components/ThreadCard/threadCard'
import { sectionParser } from '../../utils/parser'

import './sectionThreadList.scss'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  fid: string,
  title: string,
  pageNum: number
}

type PageState = {
  sectionThreadList: IThreadMeta[]
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface SectionThreadList {
  props: IProps;
}

class SectionThreadList extends Component {
  config: Config = {
    navigationBarTitleText: '板块',
    enablePullDownRefresh: true
  }

  static defaultProps = {
    fid: '',
    title: '',
    pageNum: 1
  }

  state = {
    sectionThreadList: Array<IThreadMeta>()
  }

  constructor(props) {
    super(props)
    this.props.pageNum = 1
    this.props.fid = this.$router.params.fid
    this.props.title = this.$router.params.title
  }

  componentWillReceiveProps(nextProps: { fid: string, title: string }) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    Taro.showLoading({
      title: '正在加载'
    })
    this.fetchSection(this.$router.params.fid, this.props.pageNum)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onPullDownRefresh() { }

  fetchSection(fid: string, page: number) {
    Taro.request({
      url: `https://steamcn.com/${fid}-${page}?mobile=no&orderby=dateline`,
      data: {},
      header: {},
      method: 'GET',
      dataType: 'html',
      responseType: 'text'
    }).then(res => {
      if (res.statusCode === 200) {
        const html = res.data as string

        if (html.indexOf('您必须注册并登录后才能访问此版块') > -1) {
          Taro.hideLoading()
          Taro.showToast({
            title: '本板块需要登录才可查看😦',
            icon: 'none',
            duration: 3500
          })
        } else {
          const data = sectionParser(html, this.props.title)
          this.setState({
            sectionThreadList: data
          })
          Taro.hideLoading()
        }
      } else {

      }
    })
  }

  render() {
    const { sectionThreadList } = this.state
    const threadCards = sectionThreadList.map(item => {
      return <ThreadCard threadMeta={item} key={item.tid}></ThreadCard>
    })
    return (
      <View className='thread-list'>
        {threadCards}
      </View>
    )
  }
}

export default SectionThreadList as ComponentClass<PageOwnProps, PageState>
