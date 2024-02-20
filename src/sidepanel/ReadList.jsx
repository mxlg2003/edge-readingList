import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { Button } from 'antd'
import { CheckCircleFilled, CloseOutlined } from '@ant-design/icons'

const ReadList = ({ pages, handleCancelRead, handleDelete, handleOpenUrl, searchTerm }) => {
  const [lang, setLang] = useState('enUS')
  const [size, setSize] = useState('small') // default is 'middle'

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.url.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    // 获取用户的 UI 语言
    const userLanguage = chrome.i18n.getUILanguage()

    // 根据 UI 语言设置 lang 状态
    if (userLanguage.startsWith('zh')) {
      setLang('zhCN')
    } else {
      setLang('enUS')
    }
  }, [])

  useEffect(() => {
    pages.map((page) => {
      console.log('🚀 ~ pages.map ~ page:', page)
    })
  }, [])
  return (
    <div className="readList">
      <ul>
        <h3>Pages you've read</h3>
        {filteredPages.map((page) => (
          <li key={page.url} onClick={() => handleOpenUrl(page.url)}>
            <span className="favIcon">
              <img src={page.favIconUrl} alt={page.title} />
            </span>

            <span className="page-title">{page.title}</span>
            <span className="time-ago">
              {formatDistanceToNow(new Date(page.creationTime), { locale: enUS, addSuffix: true })}
            </span>
            <div className="button-group">
              <Button
                onPointerDown={() => handleCancelRead(page.url)}
                style={{ padding: 0 }}
                icon={<CheckCircleFilled style={{ fontSize: '12px'}} />}
                type="text"
                size={size}
                shape="circle"
                title="Add to Unread"
              />
              <Button
                onPointerDown={() => handleDelete(page.url)}
                style={{ padding: 0 }}
                icon={<CloseOutlined style={{ fontSize: '12px'}} />}
                type="text"
                size={size}
                shape="circle"
                title="Remove"
              />
              {/* <button onClick={() => handleOpenUrl(page.url)}>Open</button> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReadList
