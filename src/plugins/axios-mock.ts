// src/plugins/axios-mock.js
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// Crear el mock
const mock = new MockAdapter(axios, { delayResponse: 500 }) // opcional: retraso para simular red

// Definir mocks
mock.onGet('/api/users').reply(200, [
    { id: 1, name: 'Erik' },
    { id: 2, name: 'Lucy' }
])

mock.onGet(/\/api\/hr\/personal\/\d+\/\d+/).reply(200, {
    "data": [
        {
            "n": "1",
            "secuenciaFuncional": null,
            "actividad": "UE-1768",
            "dni": "09689938",
            "code": "09689938",
            "codigoAirhsp": null,
            "apellidosNombres": "Cuya Camacho Adler Joel",
            "organoId": "10",
            "organo": "Direcci\u00f3n de Sistemas de Informaci\u00f3n Social",
            "unidadId": "20",
            "unidadOrganica": "Subdirecci\u00f3n de Sistemas de Informaci\u00f3n e Innovaci\u00f3n",
            "cargo": "Subdirector (e)",
            "fechaDeInicioContrato": null,
            "fechaDeInicioOfis": null,
            "tipoDeContrato": null,
            "clasificadorDeGastoContrato": null,
            "afpOnp": null,
            "nCuspp": null,
            "estado": "ACTIVO",
            "insertDate": null,
            "updatedDate": null,
            "id": "1"
        },
        {
            "n": "2",
            "secuenciaFuncional": null,
            "actividad": "UE-1768",
            "dni": "22196399",
            "code": "22196399",
            "codigoAirhsp": null,
            "apellidosNombres": "Huaman Ayala Alejandro Fernando",
            "organoId": "8",
            "organo": "Direcci\u00f3n de Desarrollo de Capacidades y Despliegue Territorial",
            "unidadId": "16",
            "unidadOrganica": "Subdirecci\u00f3n de Despliegue Territorial",
            "cargo": "Coordinador Territorial - Regi\u00f3n Ica de la Unidad Central de Focalizaci\u00f3n",
            "fechaDeInicioContrato": null,
            "fechaDeInicioOfis": null,
            "tipoDeContrato": null,
            "clasificadorDeGastoContrato": null,
            "afpOnp": null,
            "nCuspp": null,
            "estado": "ACTIVO",
            "insertDate": null,
            "updatedDate": null,
            "id": "2"
        }
    ],
    "size": "148"
})

mock.onGet(/\/api\/payroll\/\d+\/personal/).reply(200, {
    "data": [
        {
            "n": "1",
            "secuenciaFuncional": null,
            "actividad": "UE-1768",
            "code": "09689938",
            "codigoAirhsp": null,
            "fullName": "Cuya Camacho Adler Joel",
            "organoId": "10",
            "organo": "Direcci\u00f3n de Sistemas de Informaci\u00f3n Social",
            "unidadId": "20",
            "unidadOrganica": "Subdirecci\u00f3n de Sistemas de Informaci\u00f3n e Innovaci\u00f3n",
            "cargo": "Subdirector (e)",
            "fechaDeInicioContrato": null,
            "fechaDeInicioOfis": null,
            "tipoDeContrato": null,
            "clasificadorDeGastoContrato": null,
            "afpOnp": null,
            "nCuspp": null,
            "estado": "ACTIVO",
            "insertDate": null,
            "updatedDate": null,
            "id": "1"
        },
        {
            "n": "2",
            "secuenciaFuncional": null,
            "actividad": "UE-1768",
            "code": "22196399",
            "codigoAirhsp": null,
            "fullName": "Huaman Ayala Alejandro Fernando",
            "organoId": "8",
            "organo": "Direcci\u00f3n de Desarrollo de Capacidades y Despliegue Territorial",
            "unidadId": "16",
            "unidadOrganica": "Subdirecci\u00f3n de Despliegue Territorial",
            "cargo": "Coordinador Territorial - Regi\u00f3n Ica de la Unidad Central de Focalizaci\u00f3n",
            "fechaDeInicioContrato": null,
            "fechaDeInicioOfis": null,
            "tipoDeContrato": null,
            "clasificadorDeGastoContrato": null,
            "afpOnp": null,
            "nCuspp": null,
            "estado": "ACTIVO",
            "insertDate": null,
            "updatedDate": null,
            "id": "2"
        }
    ],
    "size": "148"
})

mock.onGet(/\/api\/payroll\/\d+\/\d+/).reply(200, {
    "data": [

        {
            "id": "1",
            "year": "2026",
            "number": "1",
            "month": "3",
            "payrollTypeName": "PLANILLA CAS",
            "type_id": "1",
            "id_fuente_financ": null,
            "comments": null,
            "closed": "0",
            "generateDate": "2026-02-25 20:04:27",
            "canceled": "0",
            "prepared_by": null
        },
        {
            "id": "1.1",
            "year": "2026",
            "number": "1",
            "month": "3",
            "payrollTypeName": "PLANILLA CAS",
            "type_id": "1",
            "id_fuente_financ": null,
            "comments": null,
            "closed": "0",
            "generateDate": "2026-02-25 20:04:27",
            "canceled": "0",
            "prepared_by": null
        }, {
            "id": "10",
            "year": "2026",
            "number": "1",
            "month": "3",
            "payrollTypeName": "PLANILLA CAS",
            "type_id": "1",
            "id_fuente_financ": null,
            "comments": null,
            "closed": "0",
            "canceled": "0",
            "prepared_by": null
        }, {
            "id": "9",
            "year": "2026",
            "number": "1",
            "month": "3",
            "payrollTypeName": "PLANILLA CAS",
            "type_id": "1",
            "id_fuente_financ": null,
            "comments": null,
            "closed": "0",
            "canceled": "0",
            "prepared_by": null
        }, {
            "id": "11",
            "year": "2026",
            "number": "1",
            "month": "3",
            "payrollTypeName": "PLANILLA CAS",
            "type_id": "1",
            "id_fuente_financ": null,
            "comments": null,
            "closed": "1",
            "generateDate": "2026-02-25 20:04:27",
            "canceled": "0",
            "prepared_by": null
        }, {
            "id": "12",
            "year": "2026",
            "number": "1",
            "month": "3",
            "payrollTypeName": "PLANILLA CAS",
            "type_id": "1",
            "id_fuente_financ": null,
            "comments": null,
            "closed": "1",
            "generateDate": "2026-02-25 20:04:27",
            "canceled": "0",
            "prepared_by": null
        }
    ],
    "size": "1"
})


mock.onGet(/\/api\/payroll\/concept\/\d+\/\d+/).reply(200, {
    "data": [
        {
            "id": "39",
            "name": "NETO A PAGAR (I) - (II)",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": "1600",
            "pdtCode": null,
            "description": null,
            "formula": "C23+C28-C38",
            "class": "p-sky",
            "isParent": null,
            "createdDate": "2026-03-17 14:13:46",
            "parentName": null
        },
        {
            "id": "38",
            "name": "TOTAL DESCUENTOS II = (A + B + C)",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": "1400",
            "pdtCode": null,
            "description": null,
            "formula": "C26+C33+C35",
            "class": "p-sky",
            "isParent": null,
            "createdDate": "2026-03-17 14:02:41",
            "parentName": null
        },
        {
            "id": "37",
            "name": "APORTE SOLID. POR  CONV. COLECTIVO",
            "abbreviation": null,
            "typeId": "6",
            "parentId": "34",
            "weight": "199",
            "pdtCode": null,
            "description": null,
            "formula": "C27*C37",
            "class": "",
            "isParent": null,
            "createdDate": "2026-03-15 23:04:54",
            "parentName": "OTROS DESCUENTOS"
        },
        {
            "id": "35",
            "name": "TOTAL OTROS DESCUENTOS (C)",
            "abbreviation": null,
            "typeId": null,
            "parentId": "34",
            "weight": "260",
            "pdtCode": null,
            "description": null,
            "formula": "G6",
            "class": "p-sky",
            "isParent": null,
            "createdDate": "2026-03-12 22:44:41",
            "parentName": "OTROS DESCUENTOS"
        },
        {
            "id": "34",
            "name": "OTROS DESCUENTOS",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": "250",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "p-green",
            "isParent": "1",
            "createdDate": "2026-03-12 19:56:19",
            "parentName": null
        },
        {
            "id": "33",
            "name": "TOTAL DESCUENTOS DE LEY (B)",
            "abbreviation": null,
            "typeId": null,
            "parentId": "32",
            "weight": "150",
            "pdtCode": null,
            "description": null,
            "formula": "G5",
            "class": "p-sky",
            "isParent": null,
            "createdDate": "2026-03-12 18:58:13",
            "parentName": "DESCUENTOS DE LEY"
        },
        {
            "id": "32",
            "name": "DESCUENTOS DE LEY",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": "230",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "p-green",
            "isParent": "1",
            "createdDate": "2026-03-12 18:55:15",
            "parentName": null
        },
        {
            "id": "31",
            "name": "EGRESOS QUE AFECTAN LA BASE IMPONIBLE",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": "5",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "p-green",
            "isParent": "1",
            "createdDate": "2026-03-12 18:45:27",
            "parentName": null
        },
        {
            "id": "30",
            "name": "INGRESOS",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": null,
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "p-yellow",
            "isParent": "1",
            "createdDate": "2026-03-12 18:45:27",
            "parentName": null
        },
        {
            "id": "29",
            "name": "BASE DE CALCULO  4TA CATG.",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": "170",
            "pdtCode": null,
            "description": null,
            "formula": "C27+C28",
            "class": "",
            "isParent": null,
            "createdDate": "2026-03-12 18:15:39",
            "parentName": null
        },
        {
            "id": "28",
            "name": "AGUINALDO",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": "300",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-03-12 18:15:23",
            "parentName": null
        },
        {
            "id": "27",
            "name": "BASE DE CALCULO CONTRIBUCIONES",
            "abbreviation": null,
            "typeId": null,
            "parentId": null,
            "weight": "160",
            "pdtCode": null,
            "description": null,
            "formula": "C23-C26",
            "class": "p-wine",
            "isParent": null,
            "createdDate": "2026-03-12 16:59:20",
            "parentName": null
        },
        {
            "id": "26",
            "name": "TOTAL DSCTO. QUE AFECTAN LA BASE IMPONIBLE (A)",
            "abbreviation": null,
            "typeId": null,
            "parentId": "31",
            "weight": "110",
            "pdtCode": null,
            "description": null,
            "formula": "C24+C25",
            "class": "p-sky",
            "isParent": null,
            "createdDate": "2026-03-12 16:48:53",
            "parentName": "EGRESOS QUE AFECTAN LA BASE IMPONIBLE"
        },
        {
            "id": "25",
            "name": "PAGO EN \r\nEXCESO",
            "abbreviation": null,
            "typeId": "4",
            "parentId": "31",
            "weight": "100",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-03-12 16:46:20",
            "parentName": "EGRESOS QUE AFECTAN LA BASE IMPONIBLE"
        },
        {
            "id": "24",
            "name": "TOTAL",
            "abbreviation": null,
            "typeId": null,
            "parentId": "31",
            "weight": "90",
            "pdtCode": null,
            "description": null,
            "formula": "G3",
            "class": "",
            "isParent": null,
            "createdDate": "2026-03-12 16:38:26",
            "parentName": "EGRESOS QUE AFECTAN LA BASE IMPONIBLE"
        },
        {
            "id": "23",
            "name": "TOTAL INGRESOS I",
            "abbreviation": null,
            "typeId": null,
            "parentId": "30",
            "weight": "120",
            "pdtCode": null,
            "description": null,
            "formula": "G1+G2",
            "class": "p-sky",
            "isParent": null,
            "createdDate": "2026-03-12 15:52:13",
            "parentName": "INGRESOS"
        },
        {
            "id": "22",
            "name": "ESSALUD",
            "abbreviation": "ESSALUD",
            "typeId": null,
            "parentId": null,
            "weight": "1500",
            "pdtCode": null,
            "description": null,
            "formula": "min(max(C1, BASE_MIN),BASE_MAX)*C100",
            "class": "",
            "isParent": null,
            "createdDate": "2026-03-12 11:26:17",
            "parentName": null
        },
        {
            "id": "21",
            "name": "JUDICIAL \/ COACTIVO",
            "abbreviation": null,
            "typeId": "6",
            "parentId": "34",
            "weight": "184",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-28 11:56:53",
            "parentName": "OTROS DESCUENTOS"
        },
        {
            "id": "20",
            "name": "ESSALUD + VIDA",
            "abbreviation": null,
            "typeId": "6",
            "parentId": "34",
            "weight": "182",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-28 11:56:53",
            "parentName": "OTROS DESCUENTOS"
        },
        {
            "id": "19",
            "name": "OTROS COOPAC SAN MIGUEL",
            "abbreviation": null,
            "typeId": "6",
            "parentId": "34",
            "weight": "180",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-28 11:55:41",
            "parentName": "OTROS DESCUENTOS"
        },
        {
            "id": "18",
            "name": "DIFERENCIAL  SUBSIDIO",
            "abbreviation": null,
            "typeId": "2",
            "parentId": "30",
            "weight": "55",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 23:52:20",
            "parentName": "INGRESOS"
        },
        {
            "id": "17",
            "name": "D.S. N\u00b0 327-2025-EF",
            "abbreviation": "DS327",
            "typeId": "1",
            "parentId": "30",
            "weight": "51",
            "pdtCode": null,
            "description": null,
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 23:03:25",
            "parentName": "INGRESOS"
        },
        {
            "id": "16",
            "name": "ESSALUD CAS",
            "abbreviation": "ESS",
            "typeId": "8",
            "parentId": null,
            "weight": "200",
            "pdtCode": null,
            "description": "Aporte Essalud",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": null
        },
        {
            "id": "15",
            "name": "APORTE COMISION AFP",
            "abbreviation": "AFPCOM",
            "typeId": "5",
            "parentId": "32",
            "weight": "150",
            "pdtCode": null,
            "description": "Comisi\u00f3n AFP",
            "formula": "C15*C27",
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "DESCUENTOS DE LEY"
        },
        {
            "id": "14",
            "name": "APORTE SEGURO AFP",
            "abbreviation": "AFPSEG",
            "typeId": "5",
            "parentId": "32",
            "weight": "140",
            "pdtCode": null,
            "description": "Seguro AFP",
            "formula": "C14*C27",
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "DESCUENTOS DE LEY"
        },
        {
            "id": "13",
            "name": "APORTE AFP 10%",
            "abbreviation": "AFP",
            "typeId": "5",
            "parentId": "32",
            "weight": "130",
            "pdtCode": null,
            "description": "Aporte obligatorio AFP",
            "formula": "C13*C27",
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "DESCUENTOS DE LEY"
        },
        {
            "id": "12",
            "name": "APORTE ONP",
            "abbreviation": "ONP",
            "typeId": "5",
            "parentId": "32",
            "weight": "120",
            "pdtCode": null,
            "description": "Aporte ONP",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "DESCUENTOS DE LEY"
        },
        {
            "id": "11",
            "name": "RETENCION DE 4TA",
            "abbreviation": "4TA",
            "typeId": "5",
            "parentId": "32",
            "weight": "110",
            "pdtCode": null,
            "description": "Impuesto 4ta categor\u00eda",
            "formula": "C27*C11",
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "DESCUENTOS DE LEY"
        },
        {
            "id": "10",
            "name": "INASISTENCIAS",
            "abbreviation": "INAS",
            "typeId": "3",
            "parentId": "31",
            "weight": "95",
            "pdtCode": null,
            "description": "Descuento inasistencias",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "EGRESOS QUE AFECTAN LA BASE IMPONIBLE"
        },
        {
            "id": "9",
            "name": "PERMISO PERSONAL",
            "abbreviation": "PERM",
            "typeId": "3",
            "parentId": "31",
            "weight": "90",
            "pdtCode": null,
            "description": "Descuento permiso",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "EGRESOS QUE AFECTAN LA BASE IMPONIBLE"
        },
        {
            "id": "8",
            "name": "JORNADA INCOMPLETA",
            "abbreviation": "JORN",
            "typeId": "3",
            "parentId": "31",
            "weight": "85",
            "pdtCode": null,
            "description": "Descuento por jornada incompleta",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "EGRESOS QUE AFECTAN LA BASE IMPONIBLE"
        },
        {
            "id": "7",
            "name": "TARDANZAS",
            "abbreviation": "TARD",
            "typeId": "3",
            "parentId": "31",
            "weight": "80",
            "pdtCode": null,
            "description": "Descuento por tardanzas",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "EGRESOS QUE AFECTAN LA BASE IMPONIBLE"
        },
        {
            "id": "6",
            "name": "REINTEGRO \/ COPAGO",
            "abbreviation": "REINT",
            "typeId": "2",
            "parentId": "30",
            "weight": "60",
            "pdtCode": "0236",
            "description": "Reintegros",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "INGRESOS"
        },
        {
            "id": "5",
            "name": "D.S. N\u00b0 279-2024-EF",
            "abbreviation": "DS279",
            "typeId": "1",
            "parentId": "30",
            "weight": "50",
            "pdtCode": "1053",
            "description": "Incremento DS 279-2024-EF",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "INGRESOS"
        },
        {
            "id": "4",
            "name": "D.S. N\u00b0 265-2024-EF",
            "abbreviation": "DS265",
            "typeId": "1",
            "parentId": "30",
            "weight": "40",
            "pdtCode": "1051",
            "description": "Incremento DS 265-2024-EF",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "INGRESOS"
        },
        {
            "id": "3",
            "name": "D.S. N\u00b0 313-2023-EF",
            "abbreviation": "DS313",
            "typeId": "1",
            "parentId": "30",
            "weight": "30",
            "pdtCode": "0981",
            "description": "Incremento DS 313-2023-EF",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "INGRESOS"
        },
        {
            "id": "2",
            "name": "D.S. N\u00b0 311-2022-EF",
            "abbreviation": "DS311",
            "typeId": "1",
            "parentId": "30",
            "weight": "20",
            "pdtCode": "0897",
            "description": "Incremento DS 311-2022-EF",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "INGRESOS"
        },
        {
            "id": "1",
            "name": "REMUNERACION",
            "abbreviation": "REM",
            "typeId": "1",
            "parentId": "30",
            "weight": "10",
            "pdtCode": "0131",
            "description": "Remuneraci\u00f3n principal",
            "formula": null,
            "class": "",
            "isParent": null,
            "createdDate": "2026-02-26 09:51:16",
            "parentName": "INGRESOS"
        }
    ],
    "size": 21
})

mock.onGet(/\/api\/payroll\/group\/\d+\/\d+/).reply(200, {
    "data": [
        {
            "id": "1",
            "name": "integra 1",
            "parentId": "1"
        },
        {
            "id": "2",
            "name": "g2-1",
            "parentId": "1"
        },
        {
            "id": "3",
            "name": "g3-2",
            "parentId": "2"
        }
    ],
    "size": 21
})

mock.onGet(/\/api\/payroll\/amount\/\d+\/\d+/).reply(200, {
    "data": [
        {
            "id": "1",
            "payrollGroupId": null,
            "payrollTypeId": null,
            "payrollType": "TOTAS",

            "type": "PT",
            "targetId": "0",
            "conceptId": "1",
            "iniDate": "2026-02-01",
            "endDate": null,
            "amount": "2500.00",
            "canceled": "0"
        },
        {
            "id": "2",
            "payrollGroupId": null,
            "payrollType": "TOTAS",
            "payrollTypeId": "1",
            "type": "GR",
            "targetId": "0",
            "conceptId": "2",
            "iniDate": "2026-02-01",
            "endDate": null,
            "amount": "64.19",
            "canceled": "0"
        }
    ],
    "size": 21
})

mock.onPost('/api/payroll/add-person').reply(config => {
    console.log(config);
    return [200, {}]
});

mock.onPost('/api/payroll/concept').reply(config => {
    console.log(config);
    return [200, { id: 12 }]
});

mock.onPost('/api/auth').reply(config => {
    const { username } = JSON.parse(config.data)
    return [200, {
        "success": true,
        "perms": {
            "HR_PERSONAL_REGISTER": true,
            "HR_PERSONAL_ADMIN": true,
            "HR_PERSONAL_READ": true,
            "HR_PERSONAL_DET": true,
            "HR_RESOURCE_REGISTER": true,
            "HR_RESOURCE_ADMIN": true,
            "HR_RESOURCE_READ": true,
            "HR_RESOURCE_DET": true,
            "HR_MOVEMENT_READ": true,
            "HR_MOVEMENT_REGISTER": true,
            "hr_personal_admin": true,
            "hr_resource_admin": true,
            "PAYROLL_READ": true
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NzE2ODk4MjMsImV4cCI6MTc3MTY5MzQyMywiZW1haWwiOiJocl9wZXJzb25hbF9hZG1pbkBnbWFpbC5jb20ifQ.7ZEifxzvm_XhUYjHpXYeXKmxdwyZhzz8KWX3V8_aiEI",
        "user_nicename": "personaladmin"
    }]
})

function generarNombreCompleto() {
    const consonantes = 'bcdfghjklmnpqrstvwxyz';
    const vocales = 'aeiou';

    // Generar una sílaba consonante+vocal
    function generarSílaba() {
        const c = consonantes[Math.floor(Math.random() * consonantes.length)];
        const v = vocales[Math.floor(Math.random() * vocales.length)];
        return c + v;
    }

    // Generar una palabra con 2 a 4 sílabas
    function generarPalabra() {
        const numSílabas = Math.floor(Math.random() * 3) + 2; // 2, 3 o 4 sílabas
        let palabra = '';
        for (let i = 0; i < numSílabas; i++) {
            palabra += generarSílaba();
        }
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    }

    // Generar nombre completo con 3 o 4 palabras
    const numPalabras = Math.random() < 0.5 ? 3 : 4;
    const palabras = [];
    for (let i = 0; i < numPalabras; i++) {
        palabras.push(generarPalabra());
    }

    return palabras.join(' ');
}

mock.onGet('/api/payroll/1/preview').reply(config => {

    const headers = [
        { title: 'CODE', width: 100, index: 'code', class:'center' },

        { title: 'NOMBRE COMPLETO', width: 200, index: 'fullName' },
        { title: 'PENSION', width: 200, index: 'pesnion' },
        { title: 'DIAS LABORADOS', width: 100, index: 'workedDays', class:'right' },
        {
            title: 'INGRESO', backgroundColor: '#20ab29', children: [{ title: '_REMUNERACION', code: '0131' },
            { title: 'REMUNERACION', width: 120, code: '0131', type: 1 },
            { title: '_D.S. N° 311-2022-EF', code: '0897' },
            { title: 'D.S. N° 311-2022-EF', code: '0897', type: 1, concept_id: 1 },

            { title: '_D.S. N° 313-2023-EF', code: '0981' },
            { title: 'D.S. N° 313-2023-EF', code: '0981', type: 1, class:'p-sky'},
            { title: '_D.S. N° 265-2024-EF', code: '1051' },
            { title: 'D.S. N° 265-2024-EF', code: '1051', type: 1 },
            { title: '_D.S. N° 279-2024-EF', code: '1053' },

            { title: 'D.S. N° 279-2024-EF', code: '1053', type: 1, concept_id: 12 },
            { title: '_DS 327-2025-EF', code: '' },
            { title: 'DS 327-2025-EF', code: '', type: 1 },
            { title: 'DIFERENCIAL SUBSIDIO', width: 100, code: '', type: 1 },
            { title: 'REINTEGRO / COPAGO', code: '0236' },

            { title: 'CLASIFICADOR INGRESOS', width: 100 },//15
            { title: 'TOTAL INGRESOS', backgroundColor: '#badefd', color: 'black' }]
        },
        {
            title: 'EGRESOS QUE AFECTAN LA BASE IMPONIBLE', backgroundColor: '#20ab29', children: [
                { title: 'TARDANZAS', type: 2 },
                { title: 'JORN. INCOMPLETA', width: 100, type: 2 },
                { title: 'PERMISO PERSONAL', type: 2 },

                { title: 'INASISTENCIAS/ LSGH', type: 2 },//20
                { title: 'TOTAL' },//21
                { title: 'PAGO EN EXCESO' },
                { title: 'TOTAL DSCTO. QUE AFECTAN LA BASE IMPONIBLE (A)', width: 120, backgroundColor: '#badefd', color: 'black' }]
        }, //23// { title: 'TOTAL DSCTO. QUE AFECTAN LA BASE IMPONIBLE (A)' }
        { title: 'BASE DE CALCULO CONTRIBUCIONES' },

        { title: 'BASE DE CALCULO  4TA CATG.', backgroundColor: '#5f2da3' },//25
        {
            title: 'DESCUENTOS DE LEY', backgroundColor: '#20ab29', children: [
                { title: 'SUSPENSIÓN 4TA SI/NO' },
                { title: 'RETENCION DE 4TA', type: 3 },
                { title: 'APORTE ONP', type: 3 },
                { title: 'APORTE OBLIGATORIO AFP 10%', width: 100, type: 3 },

                { title: 'APORTE SEGURO AFP', type: 3 },//30
                { title: 'APORTE COMISION AFP', type: 3 },
                { title: 'TOTAL DESCUENTOS DE LEY (B)', backgroundColor: '#badefd', color: 'black' }]
        },
        { title: 'SI/NO' },
        { title: 'APORTE SOLID. POR  CONV. COLECTIVO 0.5%', width: 100 },

        {
            title: 'OTROS DESCUENTOS', backgroundColor: '#20ab29', children: [{ title: 'OTROS COOPAC SAN MIGUEL', width: 100 },
            { title: 'ESSALUD + VIDA' },
            { title: 'JUDICIAL / COACTIVO' },
            { title: 'TOTAL OTROS DESCUENTOS (C)', width: 100, backgroundColor: '#badefd', color: 'black' },
            { title: 'TOTAL DESCUENTOS II = (A + B + C)', width: 100, backgroundColor: '#badefd', color: 'black' }]
        },

        { title: 'AGUINALDO', width: 90 },
        { title: 'NETO A PAGAR (I) - (II)', width: 100, backgroundColor: '#badefd', color: 'black' },
        { title: 'ESSALUD CAS' }


    ];
    const items = [];
    for (let i = 0; i < 20; i++) {
        items.push({
            code:1000+i,
            peopleId: i + 1,
            workedDays: 30,
            fullName: generarNombreCompleto().toUpperCase(),
            values: [30, 2500, null, 64.19, null, 50, null, 50, null,
                100, null, 100, null, null, null, null, null, null, null,
                null, null, null, null, 8, null, null, 7, 88, 9,
                736.42, 100.89, null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, null, null]
        });
    }
    return [200, {
        "id": "1",
        "year": "2026",
        "number": "1",
        "month": "3",
        "payrollTypeName": "PLANILLA CAS",
        "type_id": "1",
        "id_fuente_financ": null,
        "comments": null,
        "closed": "0",
        "generate_date": "2026-02-25 20:04:27",
        "canceled": "0",
        "prepared_by": null,
        headers,
        items
    }]
})