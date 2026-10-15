<template>
    <v-form :header="isNew ? 'Crear contenido' : 'Editar contenido'" action="/api/content/node">
        <div v-if="loading" class="content-state">
            <i class="fa fa-spinner fa-spin"></i>
            Cargando...
        </div>

        <div v-else-if="notFound && !isNew" class="content-state not-found">
            <i class="fa fa-exclamation-circle"></i>

            <h3>Contenido no encontrado</h3>

            <p>
                El contenido solicitado no existe.
            </p>

            <button type="button" class="btn-create" @click="createContent">
                <i class="fa fa-plus"></i>
                Crear contenido
            </button>
        </div>

        <template v-else>

            <span class="v-button-top-float" @click="save" style="z-index: 1000 !important;padding: 16px 18px;">
                <i class="fa fa-save"></i>
            </span>
            <div v-if="drawerOpen" class="drawer-backdrop" @click="drawerOpen = false" />
            <div class="drawer" :class="{ open: drawerOpen }" style="
    flex-direction: column;
    display: flex;
">
                <h3 class="title">Propiedades</h3>
                <div class="v-form" style="
overflow: auto;padding-bottom: 80px;
">
                    <label>Created:</label>
                    {{ date(o.created) }}
                    <label>Changed:</label>
                    {{ date(o.changed) }}
                    <label>Status:</label>
                    {{ date(o.status) }}
                    <label>Url:</label>
                    <a :href="o.url">{{ o.url }}</a>
                </div>
            </div>
            <div class="v-form">

                <label>Título:</label>

                <input v-model="o.title" required />

                <label>Contenido:</label>

                <div v-if="editor" class="editor-wrapper">
                    <component :is="'style'" v-if="embeddedCss">
                        {{ embeddedCss }}
                    </component>

                    <div class="editor-toolbar">

                        <template v-if="!htmlMode">

                            <button type="button" @click="editor.chain().focus().toggleBold().run()">
                                <b>B</b>
                            </button>

                            <button type="button" @click="editor.chain().focus().toggleItalic().run()">
                                <i>I</i>
                            </button>

                            <button type="button" @click="
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run()
                                ">
                                H2
                            </button>

                            <button type="button" @click="
                                editor
                                    .chain()
                                    .focus()
                                    .toggleBulletList()
                                    .run()
                                ">
                                Lista
                            </button>
                            <button type="button" @click="editor.chain().focus().setTextAlign('left').run()">
                                <i class="fa fa-align-left"></i>
                            </button>

                            <button type="button" @click="editor.chain().focus().setTextAlign('center').run()">
                                <i class="fa fa-align-center"></i>
                            </button>

                            <button type="button" @click="editor.chain().focus().setTextAlign('right').run()">
                                <i class="fa fa-align-right"></i>
                            </button>

                            <button type="button" @click="editor.chain().focus().setTextAlign('justify').run()">
                                <i class="fa fa-align-justify"></i>
                            </button>
                            <input style="width: 32px;" type="color" @input="
                                editor
                                    .chain()
                                    .focus()
                                    .setColor($event.target.value)
                                    .run()
                                " />
                            <button @click="drawerOpen = true">
                                Abrir drawer
                            </button>
                        </template>

                        <button type="button" class="html-button" @click="toggleHtml">
                            <i class="fa fa-code"></i>
                            {{ htmlMode ? 'Visual' : 'HTML' }}
                        </button>

                    </div>

                    <!-- Modo HTML -->
                    <textarea v-if="htmlMode" v-model="htmlSource" class="html-source view-editor scroll-area"
                        style="flex:1;overflow:auto" spellcheck="false"></textarea>

                    <EditorContent v-else :editor="editor" class="view-editor scroll-area" />

                </div>

            </div>

        </template>

    </v-form>
</template>

<script>
import { ui } from 'isobit-ui'
import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount
} from 'vue'

import axios from 'axios'

import {
    Editor,
    EditorContent
} from '@tiptap/vue-3'

import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle, Color } from '@tiptap/extension-text-style'

import {
    Node,
    mergeAttributes,
    Extension
} from '@tiptap/core'
const extractStyles = (html) => {
    const styles = []

    const content = html.replace(
        /<style\b[^>]*>[\s\S]*?<\/style>/gi,
        match => {
            styles.push(match)
            return ''
        }
    )

    return {
        styles: styles.join('\n'),
        content
    }
}
const GlobalAttributes = Extension.create({
    name: 'globalAttributes',

    addGlobalAttributes() {
        return [
            {
                types: [
                    'paragraph',
                    'heading',
                    'bulletList',
                    'orderedList',
                    'listItem',
                    'blockquote',
                ],

                attributes: {
                    class: {
                        default: null,
                        parseHTML: element =>
                            element.getAttribute('class'),
                    },

                    style: {
                        default: null,
                        parseHTML: element =>
                            element.getAttribute('style'),
                    },
                },
            },
        ]
    },
})
const Div = Node.create({
    name: 'div',

    group: 'block',

    content: 'block*',

    defining: true,

    addAttributes() {
        return {
            class: {
                default: null,
                parseHTML: element =>
                    element.getAttribute('class'),
            },

            style: {
                default: null,
                parseHTML: element =>
                    element.getAttribute('style'),
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes),
            0,
        ]
    },
})
/*
 * Nodo genérico para iframe.
 *
 * Permite que Tiptap conozca:
 *
 * <iframe src="..." ...></iframe>
 */
const Iframe = Node.create({

    name: 'iframe',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            src: {
                default: null
            },

            width: {
                default: '560'
            },

            height: {
                default: '315'
            },

            frameborder: {
                default: '0'
            },

            allow: {
                default: null
            },

            allowfullscreen: {
                default: true
            },

            class: {
                default: null
            },

            style: {
                default: null
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'iframe'
            }
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'iframe',
            mergeAttributes(
                HTMLAttributes
            )
        ]
    }
})


export default ui({

    props: ["id"],

    components: {
        EditorContent
    },

    setup({ router, id }) {

        const o = ref({
            id: null,
            title: null,

            revision: {
                body: ''
            }
        })
        const drawerOpen = ref(false)
        const embeddedStyles = ref('')
        const embeddedCss = computed(() => {
            return embeddedStyles.value
                .replace(/<style\b[^>]*>/gi, '')
                .replace(/<\/style>/gi, '')
        })

        const editor = ref(null)

        const loading = ref(true)
        const notFound = ref(false)
        const isNew = ref(false)

        /*
         * Modo código fuente.
         */
        const htmlMode = ref(false)

        /*
         * HTML original/source.
         *
         * Es importante mantenerlo porque Tiptap no conoce
         * elementos como <script> y <style>.
         */
        const htmlSource = ref('')


        /*
         * Tags que queremos conservar.
         *
         * Los tags desconocidos se eliminan,
         * pero se conserva el contenido interno.
         */
        const allowedTags = new Set([

            'P',
            'BR',
            'HR',

            'DIV',
            'SPAN',

            'STRONG',
            'B',

            'EM',
            'I',

            'U',
            'S',

            'A',

            'H1',
            'H2',
            'H3',
            'H4',
            'H5',
            'H6',

            'UL',
            'OL',
            'LI',

            'BLOCKQUOTE',

            'PRE',
            'CODE',

            'TABLE',
            'THEAD',
            'TBODY',
            'TFOOT',
            'TR',
            'TH',
            'TD',
            'CAPTION',

            'IMG',

            'VIDEO',
            'AUDIO',
            'SOURCE',

            'IFRAME',
            'EMBED',
            'OBJECT',
            'PARAM',

            /*
             * Se conservan como texto HTML.
             * Tiptap no los ejecuta.
             */
            'STYLE',
            'SCRIPT'
        ])

        const cleanHtml = (html) => {

            if (!html) {
                return ''
            }

            const doc =
                new DOMParser().parseFromString(
                    html,
                    'text/html'
                )

            const cleanNode = (node) => {

                /*
                 * Copia porque vamos a modificar
                 * la colección mientras iteramos.
                 */
                const children =
                    Array.from(node.children)

                for (const child of children) {

                    cleanNode(child)

                    if (!allowedTags.has(child.tagName)) {

                        child.replaceWith(
                            ...Array.from(
                                child.childNodes
                            )
                        )
                    }
                }
            }

            cleanNode(doc.body)

            return doc.body.innerHTML
        }

        const initEditor = (html = '') => {

            editor.value?.destroy()

            const extracted = extractStyles(html)

            embeddedStyles.value = extracted.styles

            editor.value = new Editor({

                extensions: [
                    StarterKit,

                    Image.configure({
                        inline: false,
                        allowBase64: true
                    }),

                    Div,
                    Iframe,
                    GlobalAttributes,

                    TextAlign.configure({
                        types: [
                            'heading',
                            'paragraph'
                        ]
                    }),

                    TextStyle,
                    Color
                ],

                // IMPORTANTE
                content: extracted.content,

                onUpdate: ({ editor }) => {

                    if (!htmlMode.value) {

                        if (!o.value.revision) {
                            o.value.revision = {}
                        }

                        const visualHtml = editor.getHTML()

                        o.value.revision.body =
                            embeddedStyles.value +
                            '\n' +
                            visualHtml
                    }
                }
            })
        }

        const toggleHtml = () => {
            if (!htmlMode.value) {
                const visualHtml = editor.value?.getHTML() || ''
                htmlSource.value =
                    embeddedStyles.value +
                    '\n' +
                    visualHtml

                htmlMode.value = true
                return
            }


            /*
             * HTML -> VISUAL
             */

            const cleaned =
                //cleanHtml(
                htmlSource.value
            //)

            htmlSource.value = cleaned

            if (!o.value.revision) {
                o.value.revision = {}
            }

            o.value.revision.body = cleaned

            /*
             * Separamos nuevamente los <style>
             */
            const extracted =
                extractStyles(cleaned)

            embeddedStyles.value =
                extracted.styles

            /*
             * A Tiptap SOLO le damos lo que puede editar.
             */
            editor.value?.commands.setContent(
                extracted.content
            )

            htmlMode.value = false
        }

        const createContent = () => {

            notFound.value = false
            isNew.value = true

            o.value = {
                id: id || null,
                title: '',
                revision: {
                    body: ''
                }
            }

            htmlSource.value = ''
            htmlMode.value = false

            initEditor('')
        }

        onMounted(async () => {

            if (!id) {

                loading.value = false

                createContent()

                return
            }

            try {

                loading.value = true
                notFound.value = false

                const response =
                    await axios.get(
                        `/api/content/node/${id}`
                    )

                o.value =
                    response.data

                /*
                 * Nos aseguramos que revision exista.
                 */
                if (!o.value.revision) {
                    o.value.revision = {
                        body: ''
                    }
                }

                const body =
                    o.value.revision.body || ''

                /*
                 * Guardamos el HTML original.
                 */
                htmlSource.value =
                    body

                initEditor(
                    body
                )

            } catch (error) {

                if (
                    error.response?.status === 404
                ) {

                    notFound.value = true

                    o.value = {
                        id: id,
                        title: '',
                        revision: {
                            body: ''
                        }
                    }

                } else {

                    console.error(
                        "Error cargando contenido:",
                        error
                    )
                }

            } finally {

                loading.value = false
            }
        })


        onBeforeUnmount(() => {

            editor.value?.destroy()
        })


        const save = async () => {

            if (!o.value.revision) {

                o.value.revision = {
                    body: ''
                }
            }


            /*
             * Si estamos viendo HTML,
             * el textarea es la fuente.
             */
            if (htmlMode.value) {

                htmlSource.value =
                    cleanHtml(
                        htmlSource.value
                    )

                o.value.revision.body =
                    htmlSource.value

            } else {

                /*
                 * Si NO tenemos contenido avanzado
                 * podemos utilizar directamente
                 * el HTML de Tiptap.
                 */
                const visualHtml =
                    editor.value?.getHTML() || ''

                const hasAdvancedHtml =
                    /<(script|style|embed|object)\b/i
                        .test(htmlSource.value)

                if (!hasAdvancedHtml) {

                    o.value.revision.body =
                        visualHtml

                    htmlSource.value =
                        visualHtml
                }
            }


            const response =
                await axios.post(
                    '/api/content/node',
                    o.value
                )

            /*close({
                success: true,
                data: response.data
            })*/
        }


        const close = ({
            success,
            data
        }) => {

            let _o = o.value

            if (success === true) {

                _o.id =
                    data.id

                _o.tmpId =
                    data.tmpId

                if (data.uploaded) {
                    delete _o.tempFile
                }
            }

            o.value = _o

            const nid =
                _o.tmpId
                    ? -_o.tmpId
                    : _o.id

            if (id != nid) {

                router.replace(
                    "/admin/content/node"
                )
            }
        }


        return {
            o,
            editor,
            loading,
            notFound,
            isNew,

            htmlMode,
            htmlSource,
            embeddedStyles,
            embeddedCss,
            toggleHtml,
            createContent,

            save,
            close,
            drawerOpen
        }
    }
})
</script>

<style scoped>
.editor-wrapper {
    border: 1px solid #ccc;
    border-radius: 4px;
}

.editor-toolbar {
    display: flex;
    gap: 5px;
    padding: 7px;
    border-bottom: 1px solid #ddd;
}

.editor-toolbar button {
    min-width: 34px;
    padding: 5px 8px;
    cursor: pointer;
}

.editor-wrapper :deep(.tiptap) {
    min-height: 300px;
    padding: 12px;
    outline: none;
}

.content-state {
    padding: 60px 20px;
    text-align: center;
}

.not-found {
    opacity: 0.7;
}

.not-found i {
    font-size: 40px;
    margin-bottom: 10px;
}

.not-found h3 {
    margin: 10px 0 5px;
}

.editor-wrapper {
    height: 0px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.v-form {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.editor-wrapper>.view-editor {
    overflow: auto;
    height: 0;
    flex: 1;
}

.workspace {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
}

.workspace-content {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.drawer {
    position: absolute;
    z-index: 100;

    top: 0;
    right: 0;

    width: 420px;
    height: 100%;

    background: white;
    box-shadow: -4px 0 12px #0003;

    transform: translateX(100%);
    transition: transform 0.25s ease;
}

.drawer.open {
    transform: translateX(0);
}

.drawer-backdrop {
    position: absolute;
    inset: 0;
    z-index: 90;

    background: rgb(0 0 0 / 30%);
}

.drawer {
    z-index: 100;
}
</style>