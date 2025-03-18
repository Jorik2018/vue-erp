import { createI18n } from "vue-i18n";

const messages = {
    en: {
        Report: 'Reports',
        RegisterDate: 'Fecha Registro',
        Sex: 'Sexo',
        Create: 'Crear',
        Edit: 'Editar',
        From: 'Desde',
        Save: 'Grabar',
        SelectOneMessage: 'Seleccionar opción',
        CrimeCategory: 'Categoría Delito',
        Observation: 'Observación',
        To: 'Hasta',
        Description: 'Descripción',
        Delete: 'Eliminar',
        Province: 'Provincia',
        GeographicLocation: 'Ubicación Geográfica',
        Type: 'Tipo',
        Date: 'Fecha',
        District: 'Distrito'
    }
};

const i18n = createI18n({
    locale: 'ja',
    fallbackLocale: 'en',
    messages
})

export default i18n