<template>
    <v-form header="Base de datos" action="/api/content/node">

        <div class="database-container">

            <!-- LISTA DE TABLAS -->
            <div class="database-tables">

                <h3>Tablas</h3>

                <div class="table-filter">
                    <input v-model="filter" type="text" placeholder="Buscar tabla..." @input="page = 1" />
                </div>

                <div v-if="loadingTables" class="database-message">
                    Cargando tablas...
                </div>

                <div v-else-if="pagedTables.length === 0" class="database-message">
                    No se encontraron tablas.
                </div>

                <div v-for="table in pagedTables" :key="tableName(table)" class="database-table" :class="{
                    active:
                        selectedTable === tableName(table)
                }">
                    <a href="#" @click.prevent="
                        selectTable(tableName(table))
                        ">
                        {{ tableName(table) }}
                    </a>
                </div>


                <!-- PAGINACIÓN -->
                <div v-if="totalPages > 1" class="pagination">

                    <button type="button" :disabled="page <= 1" @click="page--">
                        ‹
                    </button>

                    <span>
                        {{ page }} / {{ totalPages }}
                    </span>

                    <button type="button" :disabled="page >= totalPages" @click="page++">
                        ›
                    </button>

                </div>

                <div class="table-count">
                    {{ filteredTables.length }} tabla(s)
                </div>

            </div>


            <!-- ESTRUCTURA -->
            <div class="database-structure">

                <template v-if="selectedTable">

                    <div class="structure-header">

                        <div>
                            <label>Tabla</label>

                            <h2>
                                {{ selectedTable }}
                            </h2>
                        </div>

                        <button type="button" class="refresh-button" :disabled="loadingStructure"
                            @click="loadStructure">
                            ↻
                        </button>

                    </div>


                    <div v-if="loadingStructure" class="database-message">
                        Cargando estructura...
                    </div>


                    <div v-else-if="columns.length === 0" class="database-message">
                        La tabla no contiene columnas.
                    </div>


                    <div v-else class="structure-table-container">
                        <v-table :value="columns" :selectable="false" :scrollable="true" rowKey="name" :pagination="20">
                            <template v-slot="{ row, index }">

                                <td width="50" header="#" class="center">
                                    {{ index + 1 }}
                                </td>

                                <td width="180" header="Campo" class="column-name">
                                    {{ row.name }}
                                </td>

                                <td width="120" header="Tipo">
                                    {{ row.type }}
                                </td>

                                <td width="80" header="Tamaño" class="center">
                                    {{ row.size ?? '' }}
                                </td>

                                <td width="70" header="Null" class="center">
                                    <span :class="{
                                        yes: row.nullable,
                                        no: !row.nullable
                                    }">
                                        {{ row.nullable ? 'YES' : 'NO' }}
                                    </span>
                                </td>

                                <td width="60" header="PK" class="center">
                                    <span v-if="row.primaryKey" class="primary-key">
                                        PK
                                    </span>
                                </td>

                                <td width="70" header="Auto" class="center">
                                    {{ row.autoIncrement ? 'YES' : '' }}
                                </td>

                                <td width="180" header="Default">
                                    {{ row.defaultValue ?? '' }}
                                </td>

                            </template>
                        </v-table>
                    </div>

                </template>


                <div v-else class="empty-selection">
                    <div class="empty-icon">
                        ◫
                    </div>

                    <div>
                        Seleccione una tabla para ver
                        su estructura.
                    </div>
                </div>

            </div>

        </div>

    </v-form>
</template>


<script>
import { ui } from 'isobit-ui'
import {
    ref,
    computed,
    onMounted
} from 'vue'

import axios from 'axios'


export default ui({

    props: ['id'],

    setup() {

        const tables = ref([])

        const selectedTable = ref('')

        const columns = ref([])

        const filter = ref('')

        const page = ref(1)

        const pageSize = ref(20)

        const loadingTables = ref(false)

        const loadingStructure = ref(false)


        /*
         * Permite manejar tanto:
         *
         * ["users", "roles"]
         *
         * como:
         *
         * [
         *   { name: "users" },
         *   { name: "roles" }
         * ]
         */
        const tableName = (table) => {

            if (typeof table === 'string') {
                return table
            }

            return table.name ?? ''
        }


        const filteredTables = computed(() => {

            const text =
                filter.value
                    .trim()
                    .toLowerCase()

            if (!text) {
                return tables.value
            }

            return tables.value.filter(
                table =>
                    tableName(table)
                        .toLowerCase()
                        .includes(text)
            )
        })


        const totalPages = computed(() => {

            return Math.max(
                1,
                Math.ceil(
                    filteredTables.value.length
                    / pageSize.value
                )
            )
        })


        const pagedTables = computed(() => {

            if (page.value > totalPages.value) {
                page.value = totalPages.value
            }

            const start =
                (page.value - 1)
                * pageSize.value

            return filteredTables.value.slice(
                start,
                start + pageSize.value
            )
        })


        const loadTables = async () => {

            try {

                loadingTables.value = true

                const { data } =
                    await axios.get(
                        '/api/auth/database/tables'
                    )

                tables.value =
                    Array.isArray(data)
                        ? data
                        : data.items ?? []

            } catch (error) {

                console.error(
                    'Error cargando tablas:',
                    error
                )

                tables.value = []

            } finally {

                loadingTables.value = false
            }
        }


        const selectTable = async (table) => {

            selectedTable.value = table

            await loadStructure()
        }


        const loadStructure = async () => {

            if (!selectedTable.value) {
                return
            }

            try {

                loadingStructure.value = true

                columns.value = []

                const { data } =
                    await axios.get(
                        `/api/auth/database/table/${encodeURIComponent(
                            selectedTable.value
                        )
                        }`
                    )

                columns.value =
                    Array.isArray(data)
                        ? data
                        : data.columns ?? []

            } catch (error) {

                console.error(
                    'Error cargando estructura:',
                    error
                )

                columns.value = []

            } finally {

                loadingStructure.value = false
            }
        }


        onMounted(() => {
            loadTables()
        })


        return {

            tables,

            selectedTable,
            columns,

            filter,
            page,
            pageSize,

            loadingTables,
            loadingStructure,

            filteredTables,
            pagedTables,
            totalPages,

            tableName,

            selectTable,
            loadStructure
        }
    }
})
</script>


<style scoped>
.database-container {
    display: flex;
    gap: 20px;
    min-height: 500px;
}


/* ================================
   TABLAS
   ================================ */

.database-tables {
    width: 320px;
    overflow: auto;
    min-width: 320px;
    border-right: 1px solid #ddd;
    padding-right: 20px;
}

.database-tables h3 {
    margin-top: 0;
}


/* filtro */

.table-filter {
    margin-bottom: 15px;
}

.table-filter input {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
}


/* item tabla */

.database-table {
    margin-bottom: 3px;
}

.database-table a {
    display: block;

    padding: 7px 10px;

    cursor: pointer;

    text-decoration: none;

    border-radius: 3px;
}

.database-table a:hover {
    background: #f2f2f2;
}

.database-table.active a {
    background: #e5e5e5;
    font-weight: bold;
}


/* ================================
   PAGINACIÓN
   ================================ */

.pagination {
    display: flex;

    align-items: center;
    justify-content: center;

    gap: 10px;

    margin-top: 20px;
}

.pagination button {
    min-width: 32px;
    height: 30px;

    cursor: pointer;
}

.pagination button:disabled {
    cursor: default;
    opacity: .4;
}

.table-count {
    text-align: center;

    font-size: 12px;

    color: #777;

    margin-top: 8px;
}


/* ================================
   ESTRUCTURA
   ================================ */

.database-structure {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.structure-table-container>.v-datatable {
    height: -webkit-fill-available;
}

.structure-header {
    display: flex;

    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid #ddd;

    margin-bottom: 20px;

    padding-bottom: 10px;
}

.structure-header label {
    display: block;

    font-size: 12px;

    color: #777;
}

.structure-header h2 {
    margin: 3px 0 0 0;

    font-size: 20px;
}

.refresh-button {
    font-size: 20px;

    cursor: pointer;

    width: 38px;
    height: 38px;
}


/* ================================
   TABLA ESTRUCTURA
   ================================ */

.structure-table-container {
    width: 100%;

    overflow: auto;
}

.structure-table {
    width: 100%;

    border-collapse: collapse;

    font-size: 13px;
}

.structure-table th,
.structure-table td {
    padding: 8px 10px;

    border: 1px solid #ddd;

    text-align: left;

    white-space: nowrap;
}

.structure-table th {
    background: #f5f5f5;

    font-weight: 600;
}

.structure-table tbody tr:hover {
    background: #fafafa;
}

.column-name {
    font-weight: 600;
}


/* primary key */

.primary-key {
    display: inline-block;

    padding: 2px 6px;

    border-radius: 3px;

    background: #eee;

    font-size: 11px;

    font-weight: bold;
}


.yes {
    color: #268326;
}

.no {
    color: #999;
}


/* ================================
   ESTADOS
   ================================ */

.database-message {
    color: #777;

    padding: 15px 0;
}

.empty-selection {
    height: 400px;

    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    color: #888;
}

.empty-icon {
    font-size: 48px;

    margin-bottom: 10px;

    opacity: .4;
}


/* ================================
   RESPONSIVE
   ================================ */

@media (max-width: 800px) {

    .database-container {
        flex-direction: column;
    }

    .database-tables {
        width: 100%;
        min-width: 0;

        border-right: 0;
        border-bottom: 1px solid #ddd;

        padding-right: 0;
        padding-bottom: 20px;
    }

}
</style>