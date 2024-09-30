'use client'

import { useEdgeStore } from '@/lib/edgestore'
import { useState } from 'react'
import {
  MultiFileDropzone,
  type FileState,
} from '@/app/dashboard/(components)/forms/multi-file-upload'
import Link from 'next/link'

export default function MultiFileDropzoneUsage() {
  const [fileStates, setFileStates] = useState<FileState[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const { edgestore } = useEdgeStore()

  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates)
      const fileState = newFileStates.find((fileState) => fileState.key === key)
      if (fileState) {
        fileState.progress = progress
      }
      return newFileStates
    })
  }

  return (
    <div>
      <MultiFileDropzone
        value={fileStates}
        onChange={(files) => {
          setFileStates(files)
        }}
        onFilesAdded={async (addedFiles) => {
          setFileStates([...fileStates, ...addedFiles])
          await Promise.all(
            addedFiles.map(async (addedFileState) => {
              try {
                const res = await edgestore.myProtectedFiles.upload({
                  file: addedFileState.file,
                  //add mo to kapag sa form para kapag kinansel ng user ung pag input ng file hindi na sya mag aupload
                  options: {
                    temporary: true,
                  },
                  onProgressChange: async (progress) => {
                    updateFileProgress(addedFileState.key, progress)
                    if (progress === 100) {
                      // wait 1 second to set it to complete
                      // so that the user can see the progress bar at 100%
                      await new Promise((resolve) => setTimeout(resolve, 1000))
                      updateFileProgress(addedFileState.key, 'COMPLETE')
                    }
                  },
                })
                setUrls((urls) => [...urls, res.url])
                console.log(res)
              } catch (err) {
                updateFileProgress(addedFileState.key, 'ERROR')
              }
            }),
          )
        }}
      />
      <div>
        <button
          onClick={async () => {
            for (const url of urls) {
              await edgestore.myProtectedFiles.confirmUpload({ url })
            }
          }}
        >
          Confirm
        </button>
      </div>
      {urls.map((url, index) => (
        <Link href={url} target={'_blank'}>
          URL {index + 1}
        </Link>
      ))}
    </div>
  )
}
