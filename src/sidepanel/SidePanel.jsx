import React, { useState, useEffect } from 'react'
import UnreadList from './UnreadList'
import ReadList from './ReadList'
import AddToUnreadButton from './AddToUnreadButton'
import './SidePanel.css'
const Popup = () => {
  const [pages, setPages] = useState([])
  const [currentUrl, setCurrentUrl] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // 从 storage.sync 中获取页面列表
    chrome.storage.sync.get('pages', (result) => {
      setPages(result.pages || [])
    })

    // 监听标签页切换事件
    chrome.tabs.onActivated.addListener(({ tabId }) => {
      // 获取当前标签页的 URL
      chrome.tabs.get(tabId, (tab) => {
        const url = tab?.url || ''
        setCurrentUrl(url)
      })
    })

    // 监听标签页更新事件
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      // 检查是否为当前标签页，并且页面加载完成
      if (tab?.active && changeInfo.status === 'complete') {
        const url = tab.url || ''
        setCurrentUrl(url)
      }
    })

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentUrl = tabs[0].url;
      const url = currentUrl || ''
      setCurrentUrl(url)
    });

  }, [])

  const isHttpOrHttps = (url) => url.startsWith('http://') || url.startsWith('https://')

  const updatePages = (newPages) => {
    chrome.storage.sync.set({ pages: newPages })
  }

  const findPage = (url) => pages.find((page) => page.url === url)

  const handleAddToUnread = async () => {
    if (currentUrl && isHttpOrHttps(currentUrl)) {
      const existingPage = findPage(currentUrl)

      if (existingPage) {
        // 如果当前页面已存在，更新为未读状态
        const newPages = pages.map((page) =>
          page.url === currentUrl ? { ...page, hasBeenRead: !page.hasBeenRead } : page,
        )
        setPages(newPages)
        updatePages(newPages)
      } else {
        // 如果当前页面不存在，创建新的页面
        const newPage = {
          creationTime: Date.now(),
          lastUpdateTime: Date.now(),
          hasBeenRead: false,
          title: '',
          url: currentUrl,
          favIconUrl: '',
        }

        // 使用异步函数获取页面信息
        const [tab] = await new Promise((resolve) => {
          chrome.tabs.query({ active: true, currentWindow: true }, resolve)
        })

        if (tab) {
          newPage.title = tab.title
          newPage.favIconUrl = tab.favIconUrl || ''
        }

        const newPages = [...pages, newPage]
        setPages(newPages)
        updatePages(newPages)
      }
    }
  }

  const handleMarkAsRead = (url) => {
    console.log('🚀 ~ handleMarkAsRead ~ url:', url)
    // 阻止 PointerEvent 冒泡
    event.stopPropagation()
    const newPages = pages.map((page) => (page.url === url ? { ...page, hasBeenRead: true } : page))
    setPages(newPages)
    updatePages(newPages)
  }

  const handleCancelRead = (url) => {
    console.log('🚀 ~ handleCancelRead ~ url:', url)
    // 阻止 PointerEvent 冒泡
    event.stopPropagation()
    const newPages = pages.map((page) =>
      page.url === url ? { ...page, hasBeenRead: false } : page,
    )
    setPages(newPages)
    updatePages(newPages)
  }

  const handleDelete = (url) => {
    console.log('🚀 ~ handleDelete ~ url:', url)
    // 阻止 PointerEvent 冒泡
    event.stopPropagation()
    const newPages = pages.filter((page) => page.url !== url)
    setPages(newPages)
    updatePages(newPages)
  }

  const handleOpenUrl = (url) => {
    console.log('🚀 ~ handleOpenUrl ~ url:', url)
    // 阻止 PointerEvent 冒泡
    event.stopPropagation()
    chrome.tabs.query({ url }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true })
      } else {
        chrome.tabs.create({ url })
      }
    })
  }

  return (
    <main>
      <div id="content">
        <UnreadList
          pages={pages.filter((page) => !page.hasBeenRead)}
          handleMarkAsRead={handleMarkAsRead}
          handleDelete={handleDelete}
          handleOpenUrl={handleOpenUrl}
          searchTerm={searchTerm} // 传递搜索状态
        />
        <ReadList
          pages={pages.filter((page) => page.hasBeenRead)}
          handleCancelRead={handleCancelRead}
          handleDelete={handleDelete}
          handleOpenUrl={handleOpenUrl}
          searchTerm={searchTerm} // 传递搜索状态
        />
      </div>
      <div id="guide">
        <AddToUnreadButton
          url={currentUrl}
          onClick={handleAddToUnread}
          isPageUnread={pages.some((page) => page.url === currentUrl && !page.hasBeenRead)}
        />
        <input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </main>
  )
}

export default Popup
