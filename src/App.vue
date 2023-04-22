<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-10 16:52:33
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-22 14:52:52
 * @FilePath: \ace-firefly\src\App.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<script setup lang="ts">
import { ELocalStorageKey, EUserType } from '@/types'
import { login } from '@/api/manage'
import HomeView from './views/HomeView.vue'

const formState = {
  username: 'adminPC',
  password: 'adminPC',
  flag: 1
}

const onSubmit = async () => {
  const result = await login(formState)
  if (result.code === 0) {
    localStorage.setItem(ELocalStorageKey.Token, result.data.access_token)
    localStorage.setItem(ELocalStorageKey.WorkspaceId, result.data.workspace_id)
    localStorage.setItem(ELocalStorageKey.Username, result.data.username)
    localStorage.setItem(ELocalStorageKey.UserId, result.data.user_id)
    localStorage.setItem(ELocalStorageKey.Flag, EUserType.Web.toString())
  }
}

onSubmit()
</script>

<template>
  <HomeView />
</template>

<style scoped></style>
