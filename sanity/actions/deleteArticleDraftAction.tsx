import { useState } from 'react'
import { type DocumentActionComponent, useClient } from 'sanity'

const API_VERSION = '2024-11-01'

function getDraftId(documentId: string) {
  return documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`
}

export const deleteArticleDraftAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: API_VERSION })
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const draftId = props.draft?._id ?? getDraftId(props.id)

  if (props.type !== 'article') {
    return null
  }

  const message = props.published
    ? '這會刪除橘點代表的尚未發布草稿修改，已發布文章會保留。確定要刪除草稿嗎？'
    : '這篇文章目前只有草稿，刪除後會從後台草稿列表消失。確定刪除嗎？'

  const handleConfirm = () => {
    setIsDeleting(true)
    setErrorMessage('')

    client
      .getDocument(draftId)
      .then((draft) => {
        if (!draft) {
          setErrorMessage('這篇文章目前找不到可刪除的草稿版本。')
          setIsDeleting(false)
          return null
        }

        return client.delete(draftId)
      })
      .then((result) => {
        if (result) {
          props.onComplete()
        }
      })
      .catch((error) => {
        console.error('Failed to delete article draft', error)
        setErrorMessage('刪除失敗，請確認你目前登入的帳號有刪除權限後再試一次。')
        setIsDeleting(false)
      })
  }

  return {
    label: isDeleting ? '刪除中...' : '刪除草稿',
    tone: 'critical',
    disabled: isDeleting,
    onHandle: () => setDialogOpen(true),
    dialog: isDialogOpen
      ? {
          type: 'confirm',
          tone: 'critical',
          message: (
            <>
              {message}
              {errorMessage ? (
                <>
                  <br />
                  <br />
                  {errorMessage}
                </>
              ) : null}
            </>
          ),
          onConfirm: handleConfirm,
          onCancel: () => {
            setDialogOpen(false)
            setErrorMessage('')
          },
          confirmButtonText: isDeleting ? '刪除中...' : '刪除草稿',
          cancelButtonText: '取消',
        }
      : null,
  }
}

deleteArticleDraftAction.displayName = 'DeleteArticleDraftAction'
