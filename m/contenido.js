/* contenido.js · textos de la versión móvil (maqueta), en español e inglés.
 * Todo sale del sitio publicado (v5.29.1): aquí solo se acorta para que cada vista quepa en un teléfono.
 * Para cambiar un texto, edítalo aquí; app.js arma las pantallas con estos datos.
 */
window.CONTENIDO = {
  es: {
    title: 'Diego Cayupil · Analista de datos',
    ui: {
      tabs: ['Inicio', 'Casos', 'Método', 'Sobre mí', 'Contacto'],
      tabsLabel: 'Secciones',
      back: 'Atrás', close: 'Cerrar', next: 'Siguiente', prev: 'Anterior', of: 'de',
      ask: 'Pregúntame', toLang: 'English', toLangShort: 'EN', langLabel: 'Idioma',
      cv: 'Descargar CV', cvFile: '../assets/cv/Diego-Cayupil-CV-ES.pdf',
      write: 'Escríbeme', copy: 'Copiar', copied: 'Copiado',
      tapHint: 'Toca a la derecha para avanzar',
      swipeHint: 'Desliza para ver más',
      rotate: 'Gira el teléfono para verlo más grande',
      home: 'Inicio'
    },
    home: {
      eb: ['Problema', 'Datos', 'Storytelling'],
      h1a: 'Del problema a ', h1m: 'la decisión.', h1b: 'Datos claros, bien contados.',
      lead: 'Soy Diego Cayupil, analista de datos. Convierto datos en respuestas claras para que los equipos decidan mejor.',
      status: 'Busco roles de senior data analyst y BI',
      meta: ['Santiago, Chile', 'Remoto', 'Inglés y español'],
      q: '¿Qué quieres hacer?',
      main: { t: 'Ver un caso completo', s: 'El fill rate bajó de 95 % a 88 %. ¿Dónde se pierde?', n: '7 pasos' },
      tiles: [
        { t: '¿Dónde te duele?', s: 'Elige tu problema' },
        { t: 'Cómo trabajo', s: '5 fases + IA' },
        { t: 'Conocerme', s: '4 años en datos' }
      ]
    },
    pains: {
      title: '¿Dónde te duele?', back: 'Inicio',
      h: '¿Dónde duele?', hs: 'Por ahí empiezo.', lead: 'Cuatro dolores. Elige el tuyo.',
      k: ['Hoy', 'Qué hago', 'Después'],
      cta: 'Me pasa esto: escribirte',
      list: [
        { n: 'Confianza', q: '«Los datos traen errores y nadie lo nota.»',
          a: 'Errores que nadie ve.', av: '<span class="mx no">Duplicados <b>40</b></span><span class="mx no">Sin pedido <b>87</b></span><span class="mx no">Fecha imposible <b>12</b></span>',
          b: 'Pruebo los datos antes de graficar.', bv: '<span class="mx do"><b>5</b> preguntas</span><span class="mono">llave única · huérfanos · rangos · cuadratura</span>',
          c: 'Cada número, con su prueba.', cv: '<span class="mx ok">Errores en el dashboard <b>0</b></span><span class="mono">fuente = modelo: 48.000 pedidos</span>' },
        { n: 'Claridad', q: '«Hay dashboards, pero nadie decide con ellos.»',
          a: '14 gráficos y ninguna conclusión.', av: '<span class="sq14" aria-hidden="true"></span><span class="mono">14 gráficos</span>',
          b: 'Dejo solo lo que responde la decisión.', bv: '<span class="mx do"><b>14</b> → <b>3</b></span><span class="mono">¿Qué decisión hay detrás?</span>',
          c: 'La conclusión arriba y el paso siguiente.', cv: '<span class="mono">La bodega Norte explica el 70 % de la caída.</span><span class="mx ok">Revisarla hoy</span>' },
        { n: 'Tiempo', q: '«Armar el informe toma días.»',
          a: 'El informe llega viejo.', av: '<span class="days" aria-hidden="true"><i class="on">L</i><i class="on">M</i><i class="on">X</i><i>J</i><i>V</i></span><span class="mono">3 días copiando y pegando</span>',
          b: 'Conecto las fuentes y automatizo la carga.', bv: '<span class="mono">Fuentes → BigQuery → aviso si falla</span>',
          c: 'Esos 3 días ahora son para analizar.', cv: '<span class="mx ok"><b>8:00</b></span><span class="mono">Listo el lunes, solo</span>' },
        { n: 'IA', q: '«Le preguntamos a la IA y dio tres números distintos.»',
          a: 'Misma pregunta, tres respuestas.', av: '<span class="mono">¿Cuánto vendimos en octubre?</span><span class="mx no"><b>412</b></span><span class="mx no"><b>398</b></span><span class="mx no"><b>405</b></span>',
          b: 'Defino cada métrica una vez y pruebo la IA.', bv: '<span class="mono">Venta neta = facturado − notas de crédito</span>',
          c: 'La IA da el número del dashboard.', cv: '<span class="mono">¿Cuánto vendimos en octubre?</span><span class="mx ok"><b>412</b></span>' }
      ]
    },
    cases: {
      h: 'Un caso completo.', hs: 'Nueve en camino.',
      feat: { k: 'Caso 01 · Operaciones', tag: 'Datos simulados', t: 'El fill rate a las cadenas bajó de 95 % a 88 %. ¿Dónde se pierde?', s: 'De la primera reunión al plan, con el tablero.', go: 'Ver el caso', n: '7 pasos' },
      soonH: 'Próximamente', soonN: '9 casos y concursos', soon: 'Próximamente',
      list: [
        ['Consumo masivo', 'El margen de bebidas cayó 3 puntos en octubre y nadie sabe por qué.'],
        ['Retail', 'Los quiebres de stock nos están costando ventas, pero no sé en qué tiendas ni cuánto.'],
        ['Aerolínea', 'La puntualidad cayó en noviembre. ¿Qué rutas y por qué?'],
        ['Marketplace', 'Las ventas de los sellers crecen, pero el margen por pedido baja.'],
        ['Consumo masivo', 'El forecast de la cadena falla 30 % en snacks. ¿Dónde y por qué?'],
        ['Retail', 'Las promociones del Cyber, ¿ganaron plata o solo movieron ventas de una semana a otra?'],
        ['Aerolínea', 'Bajamos precios y el load factor no subió. ¿En qué rutas falló?'],
        ['Banca retail', 'La morosidad de las tarjetas nuevas sube. ¿Qué cohortes?'],
        ['Marketplace', 'Compran una vez y no vuelven. ¿Qué categorías traen clientes que sí vuelven?'],
        ['Concursos de la comunidad', 'Retos de Onyx DataDNA']
      ]
    },
    story: {
      label: 'Caso 01 · Fill rate',
      intro: {
        k: 'Caso 01 · Operaciones · datos simulados',
        t: 'El fill rate a las cadenas bajó de 95 % a 88 %. ¿Dónde se pierde?',
        h: 'Cuatro cadenas, un número que nadie medía.',
        rows: [
          ['Quién', 'Despensa Quila, un fabricante de abarrotes (ficticio) que despacha a cuatro cadenas de supermercados.'],
          ['Qué piden', '«Cada cadena me reclama con su propio número. Necesito un solo número para las cuatro.»'],
          ['En juego', 'Los acuerdos exigen 95 % de fill rate. Meses después, el número cae a 88 %.']
        ],
        go: 'Empezar por el paso 1'
      },
      k: ['El problema', 'Lo que hice', 'El resultado'],
      part: ['Parte 1', 'Parte 2'],
      step: 'paso',
      steps: [
        { ph: 'Definir', t: 'Un solo número para las cuatro cadenas.',
          p: 'Cada cadena reclamaba con su número: el mismo trimestre daba 95 %, 90 % o 59 %.',
          d: 'Acordé qué es cumplir: lo que la cadena recibe completo y a tiempo, en unidades.',
          r: 'Una definición y una meta: fill rate en unidades, 95 %.',
          v: '<div class="v3"><span class="no">95 %</span><span class="no">90 %</span><span class="no">59 %</span><i>→</i><span class="ok">95 %<small>una definición</small></span></div><p class="vcap">El mismo trimestre, según cómo se contara</p>' },
        { ph: 'Revisar', t: 'Cinco errores, arreglados en la fuente.',
          p: 'Tres sistemas que nadie había cruzado: 71 días no calzaban.',
          d: 'Cinco problemas de calidad, cada uno con su número y su arreglo en SQL.',
          r: '32.760 de 32.760 días calzan: se puede confiar en el dato.',
          v: '<div class="vrc"><span>Crudo</span><span class="ticks"></span><em class="no">71 días no calzan</em><span>Limpio</span><span class="bar"></span><em class="ok">32.760 de 32.760 ✓</em></div>' },
        { ph: 'Modelar', t: 'Cada unidad pedida cae en una sola columna.',
          p: 'El stock nace por SKU × centro × día: pegado a los pedidos, se repetía en cada orden.',
          d: 'Un galaxy: dos fact tables con fecha, SKU y centro compartidos.',
          r: 'Una medida simple: DIVIDE([A tiempo], [Pedidas]), sin lógica en DAX.',
          img: 'modelo', see: 'Ver el modelo' },
        { ph: 'Comunicar', t: 'Por semana, contra la meta y contra lo normal.',
          p: 'No existía ningún informe: nadie veía si se cumplía.',
          d: 'Probé año, trimestre, mes, semana y día: por semana calza con la reunión de los lunes.',
          r: 'Un tablero que responde solo: la pregunta arriba y la respuesta debajo.',
          img: 'p1', see: 'Ver el tablero' },
        { ph: 'Definir', t: 'La caída real es de 4,94 puntos, no de 7.',
          p: '«Bajó de 95 % a 88 %»: pero el 88 % era una sola semana.',
          d: 'Comparé 13 semanas contra 13, con los datos limpios.',
          r: '94,90 % → 89,96 %: −4,94 pts. Ahora se puede buscar dónde.',
          v: '<div class="vsd"><p class="said"><span>Lo que se dijo</span><b>95 % → 88 %</b><em>−7 pts</em></p><p class="data"><span>Lo que dicen los datos</span><b>94,90 % → 89,96 %</b><em>−4,94 pts</em></p></div>' },
        { ph: 'Analizar', t: 'No es un problema: son tres.',
          p: 'Tres sospechas: ¿falta stock, Concepción despacha lento o la asignación castiga a una cadena?',
          d: 'Probé cinco hipótesis: la caída es real (19 veces lo normal) y descarté dos.',
          r: 'Tres causas, en tres lugares: −2,43 · −2,19 · −1,03 pts.',
          v: '<div class="vbars"><p><span>8 SKU sin stock en Santiago</span><i style="--w:49%"></i><b>−2,43</b></p><p><span>Concepción despacha tarde</span><i style="--w:44%"></i><b>−2,19</b></p><p><span>Canelo rechaza en el andén</span><i style="--w:21%"></i><b>−1,03</b></p></div>' },
        { ph: 'Comunicar', t: 'Prometer 94,5 % para diciembre, no 95.',
          p: 'Aun arreglando todo, diciembre quedaba entre 94,88 % y 95,60 %: la meta, en el borde.',
          d: 'Tres acciones, con dueño y fecha: stock, despacho y citas con Canelo.',
          r: '+18.801 unidades por trimestre y una promesa que se puede cumplir: 94,5 %.',
          img: 'p3', see: 'Ver el plan' }
      ],
      outro: {
        k: 'Cómo terminó', big: '+18.801', bigS: 'unidades por trimestre',
        t: 'Y una promesa que se puede cumplir: 94,5 % para diciembre.',
        s: 'De la primera reunión al plan, en siete pasos.',
        shots: [['p1', 'Seguimiento'], ['p3', 'Plan']],
        a1: 'Escríbeme sobre un caso así', a2: 'Cómo trabajo', a3: 'Ver otros casos'
      },
      img: {
        p1: '¿Estamos cumpliendo con las cadenas? El tablero de seguimiento: fill rate de 89,96 %, −4,94 pts contra las 13 semanas anteriores.',
        p3: '¿Qué arreglamos? El plan: +18.801 unidades por trimestre con tres acciones, cada una con dueño y fecha.',
        modelo: 'El modelo: dos fact tables (líneas de pedido y stock diario) con dimensiones de fecha, SKU, cadena y centro.'
      }
    },
    method: {
      seg: ['5 fases', 'Con IA'],
      h: 'Todo parte con definir.', hs: 'Lo demás es el resultado.', lead: 'Las mismas cinco fases hacen que la IA responda bien.',
      main: 'Lo principal',
      phases: [
        { id: 'definir', n: '01', name: 'Definir', en: 'Problem framing', line: '«Necesito un dashboard» no es un problema.' },
        { id: 'revisar', n: '02', name: 'Revisar', en: 'Data quality', line: 'No construyo sobre datos que no he probado.' },
        { id: 'modelar', n: '03', name: 'Modelar', en: 'Data modelling', line: 'Un número, una sola versión.' },
        { id: 'analizar', n: '04', name: 'Analizar', en: 'Insights', line: 'No te muestro datos. Te digo qué hacer.' },
        { id: 'comunicar', n: '05', name: 'Comunicar', en: 'Storytelling + UX', line: 'Si hay que explicarlo, todavía no está listo.' }
      ],
      ai: {
        h: 'Uso IA todos los días.', hs: 'Nunca a ciegas.', lead: 'Así armo cada proyecto de Power BI.',
        steps: [
          ['Defino', 'Yo', '«¿Qué bodega arreglo primero?»', 'La pregunta de negocio'],
          ['Arma', 'La IA', 'OTIF % = DIVIDE([Pedidos OTIF], [Pedidos])', 'El SQL en BigQuery y las medidas DAX'],
          ['Compruebo', 'Yo', 'Fuente 48.000 = Modelo 48.000 ✓', 'Cada número contra la fuente'],
          ['Decido', 'Yo', 'La bodega Norte explica el 70 %', 'Qué dice el dashboard']
        ],
        loop: 'si no cuadra, se rehace', with: 'Con', tools: ['Claude Code', 'Power BI MCP server', 'BigQuery'],
        never: 'Nunca', neverL: 'permiso de escritura · datos personales en un chat · un número sin su fuente'
      }
    },
    phase: {
      back: 'Método',
      io: ['Lo que llega', 'Lo que sale'],
      noYes: ['No lo hago', 'Lo hago'],
      pairsH: 'Lo que no hago,', pairsHs: 'y lo que sí.',
      doneK: 'Cómo sé que terminé',
      next: 'Siguiente fase', full: 'Ver la fase completa', last: 'Verlo en un caso',
      cards: ['La idea', 'El método', 'Qué hago y qué no', 'Cómo sé que terminé'],
      list: {
        definir: {
          page: '../es/definir.html',
          h: 'Todo parte aquí.', hs: 'Lo demás es el resultado.',
          p: '«Necesito un dashboard» no es un problema. Lo convierto en una decisión.',
          io: ['«Necesito un dashboard de despachos, con todo.»', '«¿Qué bodega arreglo primero?»'],
          mh: 'Definir es convertir un pedido', mhs: 'en una decisión.',
          m: [['1', '¿Qué piden?'], ['2', '¿Qué duele de verdad?'], ['3', '¿Qué se decide con eso?'], ['4', '¿Quién, y cada cuánto?'], ['5', '¿Cómo sabremos que funcionó?'], ['6', '¿Qué queda fuera?']],
          pairs: [['A quién escucho', 'A una sola persona', 'A quien decide y a quien sufre el dato'], ['Por dónde parto', '«¿Qué informes necesitas?»', 'El Excel de cada lunes'], ['El alcance', '«Quiero ver todo»', 'De «todo» a una decisión'], ['El éxito', 'Prometer un gráfico a ciegas', 'Acordar cómo se mide']],
          dh: 'La ficha está firmada.', dhs: 'Ahora sí se puede construir.',
          done: [['Una decisión', 'Qué empujar y qué dejar de comprar.'], ['Un dueño y un ritmo', 'Carlos y Paula, cada lunes.'], ['Un éxito que se mide a 90 días', 'Paula deja de exportar; el margen sube 1 punto.'], ['Lo que queda fuera, por escrito', 'Por vendedor: versión 2.']]
        },
        revisar: {
          page: '../es/revisar.html',
          h: 'Encuentro por qué', hs: 'tu número no cuadra.',
          p: 'Primero acordamos qué significa el número. Después pruebo si los datos lo sostienen. Si no pasan, paro y lo digo por escrito.',
          io: ['«Los datos están bien, confía.»', '2 definiciones de «a tiempo»: 94,1 % y 92,4 %. Manda la del cliente.'],
          mh: 'Cinco preguntas', mhs: 'antes del primer gráfico.',
          m: [['¿Llegó?', 'Freshness · volume · schema'], ['¿Cada fila es única?', 'Primary key · grain'], ['¿Está completo y es creíble?', 'Not null · accepted values · range'], ['¿Conecta?', 'Referential integrity'], ['¿Cuadra?', 'Reconciliation']],
          pairs: [['El diccionario', 'Creerle sin probar', 'Lo pruebo con data profiling'], ['Las keys', 'Modelar aunque no calcen', 'Primary keys y orphan rows'], ['Lo raro', 'Borrar filas en silencio', 'Lo marco y pregunto'], ['Dónde limpio', 'A mano, o en Power Query', 'En la fuente, con SQL']],
          dh: 'Cada número tiene veredicto.', dhs: 'Y lo que no calzó, con dueño y fecha.',
          done: [['Dentro de la tolerancia, o aceptado por escrito', 'Costo: 0,59 %, aceptado por Contabilidad.'], ['Filas marcadas, no borradas', '1043 sin fecha, avisada al dueño.'], ['Cada hallazgo se repite con el SQL', 'Cualquiera puede volver a correrlo.'], ['Lo que no probé, también por escrito', 'Devoluciones de otros canales.']]
        },
        modelar: {
          page: '../es/data-modelling.html',
          h: 'El modelo se decide', hs: 'antes de abrir Power BI.',
          p: 'Es el paso que nadie ve y del que depende todo lo que sí se ve.',
          io: ['94,1 · 96,0 · 92,4: tres cifras para el mismo OTIF.', '92,4 %: una medida. Todos leen lo mismo.'],
          mh: 'Todos miran las flores.', mhs: 'El modelo es el tronco.',
          mp: 'Modelar es ordenar los datos para que cada pregunta tenga una sola respuesta.',
          mx: ['Preguntan si cumplimos el budget. La tabla dice 20 %.', 'Vendimos $8.000 de $10.000: es 80 %. La tabla miente.'],
          chips: ['Grain', 'Fact table', 'Dimension tables', 'Keys y relationships', 'Measures'],
          pairs: [['Por dónde parto', 'Por los visuals, y parchar', 'Por la decisión'], ['El grain', 'Mezclar grains', 'Una línea, y lo pruebo'], ['El schema', 'Data Vault para un Excel', 'Star schema'], ['Los ratios', 'Sumar o promediar porcentajes', 'Measures con DIVIDE']],
          dh: 'Otra persona lo entiende sin mí.', dhs: 'Y los totales calzan.',
          done: [['Los totales calzan con la fuente', 'Venta neta: 412 en el modelo y 412 en contabilidad.'], ['Un grain por fact table', 'Una línea de boleta. El budget, en su propia tabla.'], ['Star schema, one-to-many', 'Los filtros viajan en un solo sentido.'], ['Cada measure, con nombre y descripción', 'La leen las personas. Y también la IA.']]
        },
        analizar: {
          page: '../es/analizar.html',
          h: 'De los números', hs: 'a una respuesta.',
          p: 'Un insight no es un dato curioso: es algo que cambia lo que alguien va a hacer.',
          io: ['«El OTIF bajó 1,1 puntos.»', '«La bodega Norte explica el 70 %. Revísala primero.»'],
          mh: 'Cuatro preguntas,', mhs: 'de lo que pasó a lo que conviene.',
          m: [['Qué pasó', 'El OTIF cayó 1,1 puntos en la semana 42.'], ['Por qué', 'La bodega norte explica el 70 %: tres productos sin stock.'], ['Qué viene', 'Sin cambios, la semana 44 baja a 91 %.'], ['Qué hacer', 'Revisar esta semana el punto de reposición de esos tres productos.']],
          pairs: [['El número', 'Sin comparar', 'Contra meta, historia y pares'], ['La causa', 'Correlación como causa', 'Separo señal de ruido'], ['La conclusión', 'Todo lo que encontré', 'Una frase, antes del gráfico'], ['El forecast', 'Un número exacto', 'Con rango']],
          dh: 'Hay tres insights escritos.', dhs: 'Cada uno con su acción y su dueño.',
          done: [['Una conclusión en una frase', 'La bodega norte explica el 70 % de la caída.'], ['Comparada contra la meta y la historia', '92,4 % contra una meta de 95 %; −1,1 pp en cuatro semanas.'], ['Comprobada contra la fuente', 'Filas, un total y el JOIN leído línea por línea.'], ['Una acción y un dueño', 'Visitar la bodega norte. Dueño: jefe de bodega.']]
        },
        comunicar: {
          page: '../es/comunicar.html',
          h: 'Se entiende', hs: 'sin que yo esté ahí.',
          p: 'El título dice la conclusión, un indicador manda y cada número trae su contexto.',
          io: ['8 páginas, 60 visuals, ninguna conclusión.', 'Una página. El título ya dice la conclusión.'],
          mh: 'Un dashboard,', mhs: 'cuatro decisiones.',
          m: [['Un indicador manda', 'El OTIF va primero: es lo que siente el cliente.'], ['Un punto, una explicación', 'Solo se marca la semana que cambia la historia.'], ['Dónde mirar después', 'El ranking dice qué bodega revisar primero.'], ['Contexto, no adorno', 'Cada número trae su comparación.']],
          pairs: [['Antes de construir', 'Construir y ver qué sale', 'Boceto: 10 minutos'], ['El título', '«Ventas por región»', 'Dice la conclusión'], ['La página', '12 visuals, sin conclusión', 'Un indicador manda'], ['La entrega', 'Mandar el enlace y listo', 'Reviso el uso a los 30 y 90 días']],
          dh: 'Deciden sin llamarme.', dhs: 'Y nadie arma su propio Excel.',
          done: [['El título dice la conclusión', 'El margen cae en 7 productos: subir precio o sacarlos.'], ['Una métrica manda', 'El resto la explica.'], ['Se lee en 30 segundos', 'Probado con alguien que no estuvo en el proyecto.'], ['Se sigue usando después del día 30', 'Lo que nadie abre se cambia o se saca.']]
        }
      }
    },
    about: {
      h: 'Hola, soy Diego.', hs: 'Parto siempre por el problema.',
      lead: 'Analista de datos · 4 años en retail, e-commerce y aerolíneas.',
      seg: ['Qué hago', 'Trayectoria', 'Herramientas'],
      steps: ['Entiendo qué necesita el negocio', 'Escribo el SQL en BigQuery', 'Modelo en Power BI', 'Entrego hallazgos para decidir'],
      career: [['2022', 'Data Analyst', 'Aerolínea'], ['2023', 'Data Analyst', 'Marketplace'], ['2024', 'Mejora continua', 'Marketplace'], ['2024 →', 'Data Analyst · BI', 'Retail']],
      tools: ['SQL', 'BigQuery', 'Power BI', 'Excel', 'Python'], adding: 'Sumando', toolsL: ['Tableau', 'Snowflake', 'dbt'],
      ai: 'Con IA', aiL: ['Claude Code', 'Power BI MCP server'],
      built: 'Cómo está hecho este sitio', builtPage: '../es/como-esta-hecho.html'
    },
    contact: {
      h: '¿Qué problema', hs: 'quieres resolver?',
      lead: 'Cuéntamelo con tus palabras, aunque no sepas qué datos tienes. Te respondo en un día hábil.',
      go: 'Escríbeme en 3 pasos',
      mail: 'Correo', li: 'LinkedIn', liS: 'Perfil profesional',
      cvs: ['CV en español', 'CV in English'], cvS: 'PDF · una página',
      faq: 'Preguntas rápidas', faqS: 'Remoto, idioma, cómo empezamos',
      clock: ['Ahora son las', 'en Santiago'],
      priv: 'Este sitio mide visitas solo si aceptas; sin publicidad.', privB: 'Cambiar'
    },
    compose: {
      title: 'Escríbeme', back: 'Contacto',
      k: 'Para partir, con esto me basta',
      steps: [
        ['Qué duele', 'Con tus palabras, sin tecnicismos.', 'El cierre del mes tarda una semana y nadie confía en el número.'],
        ['A quién', 'Quién lo sufre y quién decide.', 'Al equipo de finanzas; decide la gerenta.'],
        ['Qué decidirías', 'Si mañana tuvieras la respuesta.', 'Qué ajustar antes del día 5.']
      ],
      stepOf: 'Paso', review: 'Revisar el correo', h: 'Tres líneas.', hs: 'Tu correo hace el resto.',
      to: 'Para', subjectL: 'Asunto', subject: 'Un problema de datos',
      body: v => 'Hola Diego:\n\nMe duele: ' + v[0] + '\nLe pasa a: ' + v[1] + '\nSi lo supiera, decidiría: ' + v[2] + '\n\nSaludos',
      open: 'Abrir en mi correo', copyMsg: 'Copiar el mensaje', edit: 'Editar',
      note: 'Nada se envía desde esta página: se abre tu correo con el texto listo.'
    },
    ask: {
      title: 'Pregúntame', hi: 'Hola. Elige una pregunta y te respondo.', pick: 'Elige una pregunta',
      note: 'Respuestas escritas por mí. Aquí ninguna IA genera texto.',
      qa: [
        { q: '¿Qué haces?', a: 'Data analyst: SQL, Power BI y Python. Parto por definir el problema.', v: 'phases', to: '#/metodo', go: 'Cómo trabajo' },
        { q: '¿Cómo usas la IA?', a: 'La IA arma el SQL y el DAX. Yo compruebo cada número contra la fuente.', v: 'cycle', to: '#/metodo/ia', go: 'Cómo uso la IA' },
        { q: '¿Estás disponible?', a: 'Sí. Busco un rol de senior data analyst o BI.', v: 'status', to: '#/contacto', go: 'Contacto' },
        { q: '¿Puedo ver tu trabajo?', a: 'Cada caso parte de una pregunta de negocio. Datos simulados.', v: 'cases', to: '#/casos', go: 'Ver los casos' },
        { q: '¿Qué herramientas usas?', a: 'Las llenas, en el trabajo. Las de borde, sumándolas.', v: 'tools', to: '#/sobre-mi/herramientas', go: 'Sobre mí' },
        { q: '¿Tienes un CV?', a: 'Sí. Cargos, fechas y herramientas, en una página.', v: 'cv', to: 'cv', go: 'Descargar CV' },
        { q: '¿Trabajas remoto?', a: 'Sí, con horario flexible para equipos de América, Europa y Oceanía.' },
        { q: '¿En qué idioma?', a: 'Español e inglés, por escrito y en llamadas.' },
        { q: '¿Y si no sé qué datos tengo?', a: 'Es lo normal. Parto por el problema y después vemos qué huellas deja tu negocio.' },
        { q: '¿Cómo empezamos?', a: 'Me escribes y te respondo con preguntas o una propuesta en un día hábil.', to: '#/contacto/escribir', go: 'Escríbeme' }
      ],
      vis: { avail: 'Disponible', where: ['Santiago, Chile', 'Remoto', 'EN · ES'], phases: 'Definir · Revisar · Modelar · Analizar · Comunicar', cycle: ['Yo', 'IA', 'Yo', 'Yo'], cycleL: 'Defino · Arma · Compruebo · Decido', cases: ['caso completo', 'en camino'], cv: 'PDF · EN · ES' }
    },
    desk: {
      k: 'Maqueta · versión móvil', h: 'Tu sitio, pensado como una app.',
      p: 'Cada vista cabe en la pantalla y se navega tocando, sin scroll. Ábrelo en tu teléfono para probarlo de verdad.',
      qr: 'Escanea para abrirlo en el teléfono', full: 'Ir al sitio completo', fullHref: '../es/'
    }
  },

  en: {
    title: 'Diego Cayupil · Data analyst',
    ui: {
      tabs: ['Home', 'Cases', 'Method', 'About', 'Contact'],
      tabsLabel: 'Sections',
      back: 'Back', close: 'Close', next: 'Next', prev: 'Previous', of: 'of',
      ask: 'Ask me', toLang: 'Español', toLangShort: 'ES', langLabel: 'Language',
      cv: 'Download CV', cvFile: '../assets/cv/Diego-Cayupil-CV-EN.pdf',
      write: 'Write to me', copy: 'Copy', copied: 'Copied',
      tapHint: 'Tap on the right to continue',
      swipeHint: 'Swipe to see more',
      rotate: 'Turn your phone to see it bigger',
      home: 'Home'
    },
    home: {
      eb: ['Problem', 'Data', 'Storytelling'],
      h1a: 'From problem to ', h1m: 'decision.', h1b: 'Clear data, well told.',
      lead: 'I’m Diego Cayupil, a data analyst. I turn data into clear answers so teams can make better decisions.',
      status: 'Open to senior data analyst & BI roles',
      meta: ['Santiago, Chile', 'Remote', 'English and Spanish'],
      q: 'What would you like to do?',
      main: { t: 'See a complete case', s: 'Fill rate fell from 95% to 88%. Where is it lost?', n: '7 steps' },
      tiles: [
        { t: 'Where does it hurt?', s: 'Pick your problem' },
        { t: 'How I work', s: '5 phases + AI' },
        { t: 'Get to know me', s: '4 years in data' }
      ]
    },
    pains: {
      title: 'Where does it hurt?', back: 'Home',
      h: 'Where does it hurt?', hs: 'That’s where I start.', lead: 'Four pains. Pick yours.',
      k: ['Today', 'What I do', 'After'],
      cta: 'This is us: write to me',
      list: [
        { n: 'Trust', q: '“The data has errors and nobody notices.”',
          a: 'Errors nobody sees.', av: '<span class="mx no">Duplicates <b>40</b></span><span class="mx no">No order <b>87</b></span><span class="mx no">Impossible date <b>12</b></span>',
          b: 'I test the data before charting it.', bv: '<span class="mx do"><b>5</b> questions</span><span class="mono">primary key · orphan rows · ranges · reconciliation</span>',
          c: 'Every number, with its proof.', cv: '<span class="mx ok">Errors in the dashboard <b>0</b></span><span class="mono">source = model: 48,000 orders</span>' },
        { n: 'Clarity', q: '“We have dashboards, but nobody decides with them.”',
          a: '14 charts, no conclusion.', av: '<span class="sq14" aria-hidden="true"></span><span class="mono">14 charts</span>',
          b: 'I keep only what answers the decision.', bv: '<span class="mx do"><b>14</b> → <b>3</b></span><span class="mono">What decision is behind it?</span>',
          c: 'The conclusion on top, then the next step.', cv: '<span class="mono">The North warehouse explains 70% of the drop.</span><span class="mx ok">Check it today</span>' },
        { n: 'Time', q: '“Building the report takes days.”',
          a: 'The report arrives old.', av: '<span class="days" aria-hidden="true"><i class="on">M</i><i class="on">T</i><i class="on">W</i><i>T</i><i>F</i></span><span class="mono">3 days copying and pasting</span>',
          b: 'I connect the sources and automate the load.', bv: '<span class="mono">Sources → BigQuery → alert if it fails</span>',
          c: 'Those 3 days now go to analysis.', cv: '<span class="mx ok"><b>8:00</b></span><span class="mono">Ready on Monday, by itself</span>' },
        { n: 'AI', q: '“We asked the AI and got three different numbers.”',
          a: 'Same question, three answers.', av: '<span class="mono">How much did we sell in October?</span><span class="mx no"><b>412</b></span><span class="mx no"><b>398</b></span><span class="mx no"><b>405</b></span>',
          b: 'I define each metric once and test the AI.', bv: '<span class="mono">Net sales = invoiced − credit notes</span>',
          c: 'The AI gives the dashboard’s number.', cv: '<span class="mono">How much did we sell in October?</span><span class="mx ok"><b>412</b></span>' }
      ]
    },
    cases: {
      h: 'One complete case.', hs: 'Nine on the way.',
      feat: { k: 'Case 01 · Operations', tag: 'Simulated data', t: 'Fill rate to the chains fell from 95% to 88%. Where is it lost?', s: 'From the first meeting to the plan, with the dashboard.', go: 'See the case', n: '7 steps' },
      soonH: 'Coming soon', soonN: '9 cases and challenges', soon: 'Coming soon',
      list: [
        ['Consumer goods', 'Beverage margin fell 3 points in October and nobody knows why.'],
        ['Retail', 'Stock-outs are costing us sales, but I don’t know in which stores or how much.'],
        ['Airline', 'On-time performance fell in November. Which routes, and why?'],
        ['Marketplace', 'Seller sales keep growing, but margin per order is falling.'],
        ['Consumer goods', 'The chain’s forecast is off by 30% in snacks. Where, and why?'],
        ['Retail', 'The Cyber promotions: did they make money, or just move sales from one week to another?'],
        ['Airline', 'We cut prices and load factor didn’t go up. On which routes did it fail?'],
        ['Retail banking', 'Delinquency on new credit cards is rising. Which cohorts?'],
        ['Marketplace', 'They buy once and never come back. Which categories bring customers who do return?'],
        ['Community challenges', 'Onyx DataDNA challenges']
      ]
    },
    story: {
      label: 'Case 01 · Fill rate',
      intro: {
        k: 'Case 01 · Operations · simulated data',
        t: 'Fill rate to the chains fell from 95% to 88%. Where is it lost?',
        h: 'Four chains, one number nobody measured.',
        rows: [
          ['Who', 'Despensa Quila, a (fictional) grocery maker that ships to four supermarket chains.'],
          ['The ask', '“Each chain complains with its own number. I need one number for all four.”'],
          ['At stake', 'The agreements require a 95% fill rate. Months later, it drops to 88%.']
        ],
        go: 'Start with step 1'
      },
      k: ['The problem', 'What I did', 'The result'],
      part: ['Part 1', 'Part 2'],
      step: 'step',
      steps: [
        { ph: 'Define', t: 'One number for all four chains.',
          p: 'Each chain complained with its own number: the same quarter came out at 95%, 90% or 59%.',
          d: 'I agreed what delivering means: what the chain receives in full and on time, in units.',
          r: 'One definition and one target: fill rate in units, 95%.',
          v: '<div class="v3"><span class="no">95%</span><span class="no">90%</span><span class="no">59%</span><i>→</i><span class="ok">95%<small>one definition</small></span></div><p class="vcap">The same quarter, depending on how it was counted</p>' },
        { ph: 'Review', t: 'Five errors, fixed at the source.',
          p: 'Three systems nobody had joined: 71 days didn’t match.',
          d: 'Five quality issues, each with its count and its SQL fix.',
          r: '32,760 of 32,760 days match: the data can be trusted.',
          v: '<div class="vrc"><span>Raw</span><span class="ticks"></span><em class="no">71 days off</em><span>Clean</span><span class="bar"></span><em class="ok">32,760 of 32,760 ✓</em></div>' },
        { ph: 'Model', t: 'Every unit ordered lands in exactly one column.',
          p: 'Stock lives at SKU × center × day: attached to the orders, it repeated on every order.',
          d: 'A galaxy schema: two fact tables sharing date, SKU and center.',
          r: 'One simple measure: DIVIDE([A tiempo], [Pedidas]), no logic in DAX.',
          img: 'modelo', see: 'See the model' },
        { ph: 'Communicate', t: 'Weekly, against the target and against normal.',
          p: 'There was no report at all: nobody could see whether they delivered.',
          d: 'I tried year, quarter, month, week and day: weekly matches the Monday meeting.',
          r: 'A dashboard that answers itself: the question on top, the answer below.',
          img: 'p1', see: 'See the dashboard' },
        { ph: 'Define', t: 'The real drop is 4.94 points, not 7.',
          p: '“It fell from 95% to 88%”: but the 88% was a single week.',
          d: 'I compared 13 weeks against 13, with clean data.',
          r: '94.90% → 89.96%: −4.94 pts. Now we can look for where.',
          v: '<div class="vsd"><p class="said"><span>What was said</span><b>95% → 88%</b><em>−7 pts</em></p><p class="data"><span>What the data says</span><b>94.90% → 89.96%</b><em>−4.94 pts</em></p></div>' },
        { ph: 'Analyze', t: 'It isn’t one problem: it’s three.',
          p: 'Three suspects: missing stock, slow shipping in Concepción, or an allocation rule hurting one chain?',
          d: 'I tested five hypotheses: the drop is real (19 times normal) and I ruled out two.',
          r: 'Three causes, in three places: −2.43 · −2.19 · −1.03 pts.',
          v: '<div class="vbars"><p><span>8 SKUs out of stock in Santiago</span><i style="--w:49%"></i><b>−2.43</b></p><p><span>Concepción ships late</span><i style="--w:44%"></i><b>−2.19</b></p><p><span>Canelo rejects at the dock</span><i style="--w:21%"></i><b>−1.03</b></p></div>' },
        { ph: 'Communicate', t: 'Promise 94.5% for December, not 95.',
          p: 'Even fixing everything, December landed between 94.88% and 95.60%: the target, on the edge.',
          d: 'Three actions, with owner and date: stock, shipping and Canelo’s dock slots.',
          r: '+18,801 units per quarter and a promise we can keep: 94.5%.',
          img: 'p3', see: 'See the plan' }
      ],
      outro: {
        k: 'How it ended', big: '+18,801', bigS: 'units per quarter',
        t: 'And a promise we can keep: 94.5% for December.',
        s: 'From the first meeting to the plan, in seven steps.',
        shots: [['p1', 'Tracking'], ['p3', 'Plan']],
        a1: 'Write to me about a case like this', a2: 'How I work', a3: 'See other cases'
      },
      img: {
        p1: 'Are we delivering to the chains? The tracking dashboard: fill rate at 89.96%, −4.94 pts against the previous 13 weeks.',
        p3: 'What do we fix? The plan: +18,801 units per quarter with three actions, each with an owner and a date.',
        modelo: 'The model: two fact tables (order lines and daily stock) with date, SKU, chain and center dimensions.'
      }
    },
    method: {
      seg: ['5 phases', 'With AI'],
      h: 'It all starts with defining.', hs: 'The rest is the result.', lead: 'The same five phases make AI answer right.',
      main: 'Most important',
      phases: [
        { id: 'definir', n: '01', name: 'Define', en: 'Problem framing', line: '“I need a dashboard” is not a problem.' },
        { id: 'revisar', n: '02', name: 'Review', en: 'Data quality', line: 'I don’t build on data I haven’t tested.' },
        { id: 'modelar', n: '03', name: 'Model', en: 'Data modelling', line: 'One number, one single version.' },
        { id: 'analizar', n: '04', name: 'Analyze', en: 'Insights', line: 'I don’t show you data. I tell you what to do.' },
        { id: 'comunicar', n: '05', name: 'Communicate', en: 'Storytelling + UX', line: 'If it needs explaining, it isn’t ready yet.' }
      ],
      ai: {
        h: 'I use AI every day.', hs: 'I never trust it blind.', lead: 'This is how I build every Power BI project.',
        steps: [
          ['Define', 'Me', '“Which warehouse do I fix first?”', 'The business question'],
          ['Builds', 'AI', 'OTIF % = DIVIDE([Pedidos OTIF], [Pedidos])', 'The SQL in BigQuery and the DAX measures'],
          ['Check', 'Me', 'Source 48,000 = Model 48,000 ✓', 'Every number against the source'],
          ['Decide', 'Me', 'The North warehouse explains 70%', 'What the dashboard says']
        ],
        loop: 'if it doesn’t add up, it gets redone', with: 'With', tools: ['Claude Code', 'Power BI MCP server', 'BigQuery'],
        never: 'Never', neverL: 'write access · personal data in a chat · a number without its source'
      }
    },
    phase: {
      back: 'Method',
      io: ['What comes in', 'What goes out'],
      noYes: ['I don’t', 'I do'],
      pairsH: 'What I don’t do,', pairsHs: 'and what I do.',
      doneK: 'How I know I’m done',
      next: 'Next phase', full: 'See the full phase', last: 'See it in a case',
      cards: ['The idea', 'The method', 'What I do and don’t', 'How I know I’m done'],
      list: {
        definir: {
          page: '../define.html',
          h: 'It all starts here.', hs: 'The rest is the result.',
          p: '“I need a dashboard” is not a problem. I turn it into a decision.',
          io: ['“I need a delivery dashboard, with everything.”', '“Which warehouse do I fix first?”'],
          mh: 'Defining is turning a request', mhs: 'into a decision.',
          m: [['1', 'What do they ask for?'], ['2', 'What really hurts?'], ['3', 'What gets decided with it?'], ['4', 'Who, and how often?'], ['5', 'How will we know it worked?'], ['6', 'What stays out?']],
          pairs: [['Who I listen to', 'Just one person', 'Who decides and who suffers the data'], ['Where I start', '“What reports do you need?”', 'The Monday Excel'], ['The scope', '“I want to see everything”', 'From “all” to one decision'], ['Success', 'Promise a chart blindly', 'Agree how it’s measured']],
          dh: 'The brief is signed.', dhs: 'Now it can be built.',
          done: [['One decision', 'What to push and what to stop buying.'], ['An owner and a rhythm', 'Carlos and Paula, every Monday.'], ['Success, measured at 90 days', 'Paula stops exporting; margin rises 1 point.'], ['What stays out, in writing', 'By rep: version 2.']]
        },
        revisar: {
          page: '../review.html',
          h: 'I find out why', hs: 'your number doesn’t add up.',
          p: 'First we agree on what the number means. Then I test whether the data holds it up. If it doesn’t pass, I stop and say so in writing.',
          io: ['“The data is fine, trust me.”', '2 definitions of “on time”: 94.1% and 92.4%. The customer’s wins.'],
          mh: 'Five questions', mhs: 'before the first chart.',
          m: [['Did it arrive?', 'Freshness · volume · schema'], ['Is each row unique?', 'Primary key · grain'], ['Is it complete and credible?', 'Not null · accepted values · range'], ['Does it connect?', 'Referential integrity'], ['Does it add up?', 'Reconciliation']],
          pairs: [['The dictionary', 'Believe it untested', 'I test it with data profiling'], ['The keys', 'Model even if they don’t match', 'Primary keys and orphan rows'], ['What’s odd', 'Silently delete rows', 'I flag it and ask'], ['Where I clean', 'By hand, or in Power Query', 'At the source, with SQL']],
          dh: 'Every number has a verdict.', dhs: 'And what didn’t match, with owner and date.',
          done: [['Within tolerance, or accepted in writing', 'Cost: 0.59%, accepted by Accounting.'], ['Rows flagged, not deleted', '1043 with no date, owner notified.'], ['Every finding repeats with the SQL', 'Anyone can run it again.'], ['What I didn’t test, also in writing', 'Returns from other channels.']]
        },
        modelar: {
          page: '../model.html',
          h: 'The model is decided', hs: 'before opening Power BI.',
          p: 'It’s the step nobody sees, and everything people do see depends on it.',
          io: ['94.1 · 96.0 · 92.4: three figures for the same OTIF.', '92.4%: one measure. Everyone reads the same.'],
          mh: 'Everyone looks at the flowers.', mhs: 'The model is the trunk.',
          mp: 'Modelling is arranging the data so every question has one single answer.',
          mx: ['They ask if we hit the budget. The table says 20%.', 'We sold $8,000 of $10,000: that’s 80%. The table lies.'],
          chips: ['Grain', 'Fact table', 'Dimension tables', 'Keys & relationships', 'Measures'],
          pairs: [['Where I start', 'From the visuals, then patch', 'From the decision'], ['The grain', 'Mix grains', 'One line, and I test it'], ['The schema', 'Data Vault for one Excel', 'Star schema'], ['Ratios', 'Sum or average percentages', 'DIVIDE measures']],
          dh: 'Someone else gets it without me.', dhs: 'And the totals match.',
          done: [['Totals equal the source', 'Net sales: 412 in the model and 412 in accounting.'], ['One grain per fact table', 'One receipt line. The budget, in its own table.'], ['Star schema, one-to-many', 'Filters travel one way.'], ['Every measure, with a name and a description', 'People read it. So does the AI.']]
        },
        analizar: {
          page: '../analyze.html',
          h: 'From numbers', hs: 'to an answer.',
          p: 'An insight isn’t a curious fact: it’s something that changes what someone will do.',
          io: ['“OTIF fell 1.1 points.”', '“The North warehouse explains 70%. Check it first.”'],
          mh: 'Four questions,', mhs: 'from what happened to what to do.',
          m: [['What happened', 'OTIF fell 1.1 points in week 42.'], ['Why', 'The north warehouse explains 70%: three products out of stock.'], ['What’s next', 'With no changes, week 44 drops to 91%.'], ['What to do', 'Review the reorder point of those three products this week.']],
          pairs: [['The number', 'With no comparison', 'Against target, history and peers'], ['The cause', 'Correlation as cause', 'I split signal from noise'], ['The conclusion', 'Everything I found', 'One sentence, before the chart'], ['The forecast', 'One exact number', 'With a range']],
          dh: 'There are three written insights.', dhs: 'Each with its action and owner.',
          done: [['A conclusion in one sentence', 'The north warehouse explains 70% of the drop.'], ['Compared against target and history', '92.4% against a 95% target; −1.1 pp in four weeks.'], ['Checked against the source', 'Rows, one total, and the JOIN read line by line.'], ['An action and an owner', 'Visit the north warehouse. Owner: warehouse lead.']]
        },
        comunicar: {
          page: '../communicate.html',
          h: 'It’s understood', hs: 'without me there.',
          p: 'The title states the conclusion, one metric leads and every number has context.',
          io: ['8 pages, 60 visuals, no conclusion.', 'One page. The title already states the conclusion.'],
          mh: 'One dashboard,', mhs: 'four decisions.',
          m: [['One metric leads', 'On-time delivery goes first: it is what the customer feels.'], ['One point, one explanation', 'Only the week that changes the story is marked.'], ['Where to look next', 'The ranking says which warehouse to check first.'], ['Context, not decoration', 'Every number comes with a comparison.']],
          pairs: [['Before building', 'Build and see what happens', 'Sketch: 10 minutes'], ['The title', '“Sales by region”', 'States the conclusion'], ['The page', '12 visuals, no conclusion', 'One metric leads'], ['Delivery', 'Email the link and done', 'I check usage at 30 and 90 days']],
          dh: 'They decide without calling me.', dhs: 'And nobody builds their own Excel.',
          done: [['The title states the conclusion', 'Margin falls on 7 products: raise price or drop them.'], ['One metric leads', 'The rest explains it.'], ['It reads in 30 seconds', 'Tested with someone who wasn’t in the project.'], ['It’s still used after day 30', 'What nobody opens gets changed or removed.']]
        }
      }
    },
    about: {
      h: 'Hi, I’m Diego.', hs: 'I always start with the problem.',
      lead: 'Data analyst · 4 years in retail, e-commerce and airlines.',
      seg: ['What I do', 'Career', 'Tools'],
      steps: ['Understand what the business needs', 'Write the SQL in BigQuery', 'Model in Power BI', 'Deliver findings to decide'],
      career: [['2022', 'Data Analyst', 'Airline'], ['2023', 'Data Analyst', 'Marketplace'], ['2024', 'Continuous improvement', 'Marketplace'], ['2024 →', 'Data Analyst · BI', 'Retail']],
      tools: ['SQL', 'BigQuery', 'Power BI', 'Excel', 'Python'], adding: 'Adding', toolsL: ['Tableau', 'Snowflake', 'dbt'],
      ai: 'With AI', aiL: ['Claude Code', 'Power BI MCP server'],
      built: 'How this site is built', builtPage: '../how-this-site-is-built.html'
    },
    contact: {
      h: 'What problem', hs: 'do you want to solve?',
      lead: 'Tell me in your own words, even if you don’t know what data you have. I reply within one business day.',
      go: 'Write to me in 3 steps',
      mail: 'Email', li: 'LinkedIn', liS: 'Professional profile',
      cvs: ['CV in English', 'CV en español'], cvS: 'PDF · one page',
      faq: 'Quick questions', faqS: 'Remote, language, how we start',
      clock: ['It’s', 'in Santiago'],
      priv: 'This site measures visits only if you accept. No ads.', privB: 'Change'
    },
    compose: {
      title: 'Write to me', back: 'Contact',
      k: 'To start, this is all I need',
      steps: [
        ['What hurts', 'In your own words, no jargon.', 'The monthly close takes a week and nobody trusts the number.'],
        ['Who it hurts', 'Who suffers it and who decides.', 'The finance team; the manager decides.'],
        ['What you’d decide', 'If you had the answer tomorrow.', 'What to adjust before the 5th.']
      ],
      stepOf: 'Step', review: 'Review the email', h: 'Three lines.', hs: 'Your email does the rest.',
      to: 'To', subjectL: 'Subject', subject: 'A data problem',
      body: v => 'Hi Diego,\n\nWhat hurts: ' + v[0] + '\nWho it hurts: ' + v[1] + '\nIf I knew, I’d decide: ' + v[2] + '\n\nBest',
      open: 'Open in my email', copyMsg: 'Copy the message', edit: 'Edit',
      note: 'Nothing is sent from this page: your email opens with the text ready.'
    },
    ask: {
      title: 'Ask me', hi: 'Hi. Pick a question and I’ll answer.', pick: 'Pick a question',
      note: 'Answers written by me. No AI generates text here.',
      qa: [
        { q: 'What do you do?', a: 'Data analyst: SQL, Power BI and Python. I start by defining the problem.', v: 'phases', to: '#/metodo', go: 'How I work' },
        { q: 'How do you use AI?', a: 'AI builds the SQL and the DAX. I check every number against the source.', v: 'cycle', to: '#/metodo/ia', go: 'How I use AI' },
        { q: 'Are you available?', a: 'Yes. I’m open to senior data analyst and BI roles.', v: 'status', to: '#/contacto', go: 'Contact' },
        { q: 'Can I see your work?', a: 'Each case starts from a business question. Simulated data.', v: 'cases', to: '#/casos', go: 'See the cases' },
        { q: 'Which tools do you use?', a: 'The solid ones, at work. The outlined ones, adding them.', v: 'tools', to: '#/sobre-mi/herramientas', go: 'About' },
        { q: 'Do you have a CV?', a: 'Yes. Roles, dates and tools, on one page.', v: 'cv', to: 'cv', go: 'Download CV' },
        { q: 'Do you work remotely?', a: 'Yes, with flexible hours for teams in the Americas, Europe and Oceania.' },
        { q: 'In which language?', a: 'Spanish and English, in writing and on calls.' },
        { q: 'What if I don’t know what data I have?', a: 'That’s normal. I start with the problem and then we see what traces your business leaves.' },
        { q: 'How do we start?', a: 'You write to me and I reply with questions or a proposal within one business day.', to: '#/contacto/escribir', go: 'Write to me' }
      ],
      vis: { avail: 'Available', where: ['Santiago, Chile', 'Remote', 'EN · ES'], phases: 'Define · Review · Model · Analyze · Communicate', cycle: ['Me', 'AI', 'Me', 'Me'], cycleL: 'Define · Builds · Check · Decide', cases: ['complete case', 'on the way'], cv: 'PDF · EN · ES' }
    },
    desk: {
      k: 'Mockup · mobile version', h: 'Your site, designed as an app.',
      p: 'Every view fits the screen and you move by tapping, not scrolling. Open it on your phone to really try it.',
      qr: 'Scan to open it on your phone', full: 'Go to the full site', fullHref: '../'
    }
  }
};
