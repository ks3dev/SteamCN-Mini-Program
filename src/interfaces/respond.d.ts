export interface HotThreadItem {
  itemid: string,
  id: string,
  idtype: string,
  title: string,
  url: string,
  pic: string,
  displayorder: number,
  coverpath: string,
  content: string,
  hasAuth: boolean,
  fields: {
    fulltitle: string,
    threads: string,
    author: string,
    authorid: string,
    avatar: string,
    avatar_middle: string,
    avatar_big: string,
    posts: string,
    todayposts: string,
    lastpost: string,
    lastposter: string,
    dateline: string,
    replies: string,
    forumurl: string,
    forumname: string,
    typename: string,
    typeicon: string,
    typeurl: string,
    sortname: string,
    sorturl: string,
    views: string,
    heats: string,
    recommends: string,
    hourviews: string,
    todayviews: string,
    weekviews: string,
    monthviews: string
  }
}
