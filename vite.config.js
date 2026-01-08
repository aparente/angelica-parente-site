import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'About.html'),
                exploring: resolve(__dirname, 'Exploring.html'),
                thinking: resolve(__dirname, 'Thinking.html'),
                building: resolve(__dirname, 'Building.html'),
                contact: resolve(__dirname, 'contact.html'),
                life: resolve(__dirname, 'life.html'),
                post: resolve(__dirname, 'post.html'),
            },
        },
    },
})
