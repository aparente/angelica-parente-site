import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    base: '/angelica-parente-site/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                being: resolve(__dirname, 'Being.html'),
                thinking: resolve(__dirname, 'Thinking.html'),
                fixating: resolve(__dirname, 'Fixating.html'),
                research: resolve(__dirname, 'research.html'),
                contact: resolve(__dirname, 'contact.html'),
                life: resolve(__dirname, 'life.html'),
                post: resolve(__dirname, 'post.html'),
            },
        },
    },
})
