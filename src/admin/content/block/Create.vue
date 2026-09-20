<template>
    <v-form :header="isNew ? 'Crear bloque' : 'Editar bloque'" action="/api/content/block" class="scroll-area">
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
    display: flex;padding: 0px;
">
                <div style="padding: 20px;"><h3>Propiedades</h3></div>
                <div class="v-form scroll-area" style="
padding: 10px 10px 100px;
" @scroll="onScroll">
                    <label>{{ $t('Title') }}:</label>
                    <v-textarea v-model="o.title" />
                    <span>Sustituye el predefinido del bloque.
                        Use &lt;none&gt; para no mostrar o &lt;default&gt; para usar
                        el predefinido del bloque.</span>
                    <label>{{ $t('Status') }}:</label>
                    <v-radio-group layout="responsive" columns="1" id="type" v-model="o.status">
                        <v-radio label="Activo" value="1" />
                        <v-radio label="Oculto" value="0" />
                    </v-radio-group>
                    <label>{{ $t('Peso') }}:</label>

                    <input type="number" v-model="o.weight" />
                    <label>{{ $t('Region') }}:</label>
                    <input v-model="o.region" required="true" />
                    <v-fieldset :legend="$t('Visibility')" class="v-form">
                        <v-radio-group layout="responsive" columns="1" v-model="o.visibility">
                            <v-radio label="Siempre que no coincida con los patrones de lista" value="0"></v-radio>
                            <v-radio label="Siempre que cumpla los patrones de lista" value="1"></v-radio>
                            <v-radio label="Mostrar si el siguiente cJava devuelve el valor true (Spara expertos)."
                                value="2"></v-radio>
                        </v-radio-group>
                        <v-textarea id="pages" v-model="o.pages" />
                        <span>Especifique una ppor len forma de rutas del Sitio. El car'*' es un comodEjemplos de rutas:
                            blog para la pde blogs y blog/* para todos los blogs personales. #{bundle.LT}front> es la
                            pinicial. Si se ha elegido el modo JSP, introduzca el cJSP entre #{bundle.LT}% %>. Tenga en
                            cuenta que ejecutar cJava incorrecto puede destrozar su sitio.</span>
                    </v-fieldset>
                </div>
            </div>
            <div class="v-form">

                <label>Descripción:</label>

                <input v-model="o.ext.info" required />
      <label>{{ $t('Title') }}:</label>
                    <v-textarea v-model="o.title" />
                <label>Contenido:</label>

                <div v-if="editor" class="editor-wrapper">

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
                    <textarea v-if="htmlMode" 
                    
                    v-model="htmlSource" class="html-source scroll-area" style="flex:1;overflow: auto;" spellcheck="false"></textarea>

                    <!-- Modo visual -->
                    <EditorContent v-else :editor="editor" />

                </div>

            </div>

        </template>

    </v-form>
</template>

<script>
import { ui } from 'isobit-ui'
import {
    ref,
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
    mergeAttributes
} from '@tiptap/core'


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
            visibility: null,
            revision: {
                body: ''
            }
        })
        const drawerOpen = ref(false)

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


        /*
         * Limpia tags desconocidos.
         *
         * Ejemplo:
         *
         * <o:p>
         *     hola <a>x</a>
         * </o:p>
         *
         * queda:
         *
         * hola <a>x</a>
         */
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


        /*
         * Inicializar Tiptap.
         */
        const initEditor = (html = '') => {

            editor.value?.destroy()

            editor.value = new Editor({

                extensions: [
                    StarterKit,

                    Image.configure({
                        inline: false,
                        allowBase64: true
                    }),

                    Iframe,

                    TextAlign.configure({
                        types: [
                            'heading',
                            'paragraph'
                        ]
                    }),

                    TextStyle,
                    Color
                ],

                /*
                 * Tiptap mostrará solamente
                 * lo que pertenece a su schema.
                 */
                content: html,

                onUpdate: ({ editor }) => {

                    /*
                     * Mientras estamos en modo visual,
                     * guardamos el HTML generado.
                     */
                    if (!htmlMode.value) {

                        if (!o.value.ext) {
                            o.value.ext = {}
                        }

                        o.value.ext.body =
                            editor.getHTML()
                    }
                }
            })
        }


        /*
         * Cambiar entre Visual <-> HTML.
         */
        const toggleHtml = () => {

            /*
             * VISUAL -> HTML
             */
            if (!htmlMode.value) {

                /*
                 * Primero tomamos el contenido actual
                 * del editor visual.
                 */
                const visualHtml =
                    editor.value?.getHTML() || ''


                console.log(visualHtml);
                /*
                 * Si no hay source especial,
                 * utilizamos lo generado por Tiptap.
                 */
                if (!htmlSource.value) {
                    htmlSource.value = visualHtml
                } else {

                    /*
                     * Si el usuario trabajó antes con HTML
                     * avanzado, mantenemos ese source.
                     *
                     * De esta manera no desaparecen:
                     *
                     * <script>
                     * <style>
                     * etc.
                     */
                    const hasAdvancedHtml =
                        /<(script|style|embed|object)\b/i
                            .test(htmlSource.value)

                    if (!hasAdvancedHtml) {
                        htmlSource.value = visualHtml
                    }
                }

                htmlMode.value = true

                return
            }


            /*
             * HTML -> VISUAL
             */

            const cleaned =
                cleanHtml(
                    htmlSource.value
                )

            htmlSource.value = cleaned

            if (!o.value.ext) {
                o.value.ext = {}
            }

            /*
             * El source completo queda almacenado
             * en revision.body.
             */
            o.value.ext.body =
                cleaned

            /*
             * Tiptap utiliza el mismo HTML,
             * pero ignorará aquello que no forma
             * parte de su schema.
             */
            editor.value?.commands.setContent(
                cleaned
            )

            htmlMode.value = false
        }


        /*
         * Crear contenido cuando el GET devuelve 404.
         */
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
                        `/api/content/block/${id}`
                    )

                o.value =
                    response.data
                /*
                 * Nos aseguramos que revision exista.
                 */
                if (!o.value.ext) {
                    o.value.ext = {
                        body: ''
                    }
                }

                const body =
                    o.value.ext.body || ''

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

            if (!o.value.ext) {

                o.value.ext = {
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

                o.value.ext.body =
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

                    o.value.ext.body =
                        visualHtml

                    htmlSource.value =
                        visualHtml
                }
            }


            const response =
                await axios.post(
                    '/api/content/block',
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
                    "/admin/content/block"
                )
            }
        }

let timeout;
const onScroll = (event) => {
  const el = event.currentTarget;

  el.classList.add("scrolling");

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    el.classList.remove("scrolling");
  }, 700);
};
        return {
            o,
            editor,
onScroll,
            loading,
            notFound,
            isNew,

            htmlMode,
            htmlSource,

            toggleHtml,
            createContent,

            save,
            close,
            drawerOpen
        }
    }
})
</script>

