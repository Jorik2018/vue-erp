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


mock.onGet(/\/api\/payroll\/concept\/\d+\/\d+/).reply(200, {
    "data": [
        {
            "id": "21",
            "name": "JUDICIAL \/ COACTIVO",
            "abbreviation": null,
            "typeId": "1",
            "weight": "184",
            "pdt_code": null,
            "description": null,
            "created_date": "2026-02-28 11:56:53"
        },
        {
            "id": "20",
            "name": "ESSALUD + VIDA",
            "abbreviation": null,
            "typeId": "2",
            "weight": "182",
            "pdt_code": null,
            "description": null,
            "created_date": "2026-02-28 11:56:53"
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
  return [200, {id:12}]
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

const assignLeafIndexes = (headers) => {
  let index = 0;

  const walk = (items) => {
    items.forEach(h => {
      if (h.children && h.children.length) {
        walk(h.children);
      } else if (!h.index) {
        h.index = index++;   // solo hojas obtienen índice
      }
    });
  };

  walk(headers);
  return headers;
}



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

mock.onGet('/api/payroll/period').reply(config => {
  const { year, month } = config.params
  const headers = assignLeafIndexes([
    { title: 'NOMBRE COMPLETO', width: 200, index: 'fullName' },
    { title: 'DIAS LABORADOS', width: 100 },
    {
      title: 'INGRESO', backgroundColor: '#20ab29', children: [{ title: '_REMUNERACION', code: '0131' },
      { title: 'REMUNERACION', width: 120, code: '0131', type: 1 },
      { title: '_D.S. N° 311-2022-EF', code: '0897' },
      { title: 'D.S. N° 311-2022-EF', code: '0897', type: 1 },

      { title: '_D.S. N° 313-2023-EF', code: '0981' },
      { title: 'D.S. N° 313-2023-EF', code: '0981', type: 1 },
      { title: '_D.S. N° 265-2024-EF', code: '1051' },
      { title: 'D.S. N° 265-2024-EF', code: '1051', type: 1 },
      { title: '_D.S. N° 279-2024-EF', code: '1053' },

      { title: 'D.S. N° 279-2024-EF', code: '1053', type: 1 },
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


  ]);
  const items = [];
  for (let i = 0; i < 20; i++) {
    items.push({
      fullName: generarNombreCompleto().toUpperCase(), values: [30, 2500, null, 64.19, null, 50, null, 50, null,
        100, null, 100, null, null, null, null, null, null, null,
        null, null, null, null, 8, null, null, 7, 88, 9,
        736.42, 100.89, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null]
    });
  }
  return [200, {
    "success": true,
    "data": items,
    "headers": headers
  }]
})