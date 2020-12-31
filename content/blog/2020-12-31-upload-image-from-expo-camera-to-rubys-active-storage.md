---
layout: blog
title: "Upload Image from Expo Camera to Ruby's Active Storage "
date: 2020-12-31T14:08:59.963Z
---
For an Expo project I'm working on, we needed to upload an image captured by Expo's Camera with Ruby's Active Storage and store the files on Amazon S3. For the web you can just use the `@rails/activestorage` package to handle the upload process, but this doesn't work on React Native, so I was searching SO for alternatives to do this ([this](https://github.com/rails/rails/issues/32208#issuecomment-383737803) GitHub comment explains exactly what I needed to do). 

Such a trivial task, wasn't as straightforward as I'd hoped because when you request the signed upload URL, you need to provide a base64-encoded MD5 checksum that matches the file that you will upload to that signed upload URL. When you use `@rails/activestorage`, it uses `FileReader.readAsArrayBuffer` to calculate the checksum incrementally, which isn't available on React Native so you need to calculate this yourself.

A workaround that was mentioned around the web was to use `rn-fetch-blob`, which generates a hash of the file that can be encoded in base64. Unfortunately the package was deprecated, and I was hoping not to add another dependency just to fetch a blob and generate a checksum since Expo already provides you with the MD5 hash of a file with `expo-file-system`.

In my first attempts I tried to use `fetch` to get the blob object of a local `photo.uri` and upload that to the signed upload URL. This caused a mismatch in the MD5 hash that expo calculated for the file and the blob I was actually uploading.

Eventually I used the `uploadAsync` method of the `expo-file-system` which uploads the contents of the file to the signed upload URL.

```ts
/* FileSystem.FileInfo */
const meta = await FileSystem.getInfoAsync(photo.uri, { md5: true }

/* Base 64 of the MD5 hash of the file */
const checksum = Buffer.from(meta.md5, 'hex').toString('base64')

/* Get the signed upload URL */
const {
  blob_signed_id,
  direct_upload: { headers, url },
} = await fetch('/rails/active_storage/direct_uploads', {
    method: 'POST',
    body: {
      file: {
        filename: "photo.jpeg",
        content_type: "image/jpeg",
        byte_size: meta.size,
        checksum
      }
    })

/* Upload the file */
await FileSystem.uploadAsync(url, photo.uri, {
  headers,
  httpMethod: 'PUT',
})
```
