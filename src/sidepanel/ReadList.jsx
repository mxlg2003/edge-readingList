import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { Button } from 'antd'
import { CheckCircleFilled, CloseOutlined } from '@ant-design/icons'
import getMessage from './i18n.js'

const ReadList = ({ pages, handleCancelRead, handleDelete, handleOpenUrl, searchTerm }) => {
  const [lang, setLang] = useState('enUS')
  const [size, setSize] = useState('small') // default is 'middle'

  const filteredPages = pages.filter((page) => page.title.toLowerCase().includes(searchTerm.toLowerCase()) || page.url.toLowerCase().includes(searchTerm.toLowerCase()))
  useEffect(() => {
    const userLanguage = chrome.i18n.getUILanguage()
    setLang(userLanguage.startsWith('zh') ? 'zhCN' : 'enUS')
  }, [])
  const formatLocale = lang === 'zhCN' ? zhCN : enUS

  return (<div className="readList">
      <ul>
        <h3>{getMessage('readed')}</h3>
        {filteredPages.map((page) => (<li key={page.url} onClick={() => handleOpenUrl(page.url)}>
            <span className="favIcon">
              <img src={page.favIconUrl} alt={page.title} />
            </span>

            <span className="page-title" title={page.title}>{page.title}</span>
            <span className="time-ago">
              {formatDistanceToNow(new Date(page.creationTime), { locale: formatLocale, addSuffix: true })}
            </span>
            <div className="button-group">
              <Button
                onPointerDown={() => handleCancelRead(page.url)}
                style={{ padding: 0 }}
                icon={<CheckCircleFilled style={{ fontSize: '12px' }} />}
                type="text"
                size={size}
                shape="circle"
                title={getMessage('addtoUnread')}
              />
              <Button
                onPointerDown={() => handleDelete(page.url)}
                style={{ padding: 0 }}
                icon={<CloseOutlined style={{ fontSize: '12px' }} />}
                type="text"
                size={size}
                shape="circle"
                title={getMessage('remove')}
              />
            </div>
          </li>))}
      </ul>
    </div>)
}

export default ReadList
