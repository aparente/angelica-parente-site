import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/angelica-parente-site/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                bio: resolve(__dirname, 'bio.html'),
                contact: resolve(__dirname, 'contact.html'),
                research: resolve(__dirname, 'research.html'),
                likes: resolve(__dirname, 'likes.html'),
                writing: resolve(__dirname, 'writing.html'),
                life: resolve(__dirname, 'life.html'),
                post: resolve(__dirname, 'post.html'),
            },
        },
    },
})
