// ** React Import
import { Children } from 'react'

// ** Next Import
import Document, { Html, Head, Main, NextScript } from 'next/document'

// ** Emotion Imports
import createEmotionServer from '@emotion/server/create-instance'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='es'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap'
          />
          <link rel='apple-touch-icon' sizes='180x180' href='/images/pwa/apple-touch-icon.png' />
          <link rel='shortcut icon' href='/images/favicon.png' />

          {/* SEO & Meta Tags */}
          <meta
            name='description'
            content='HC-SCAN (Helpcopies Scan) - Sistema SaaS multitenant para ingesta inteligente de documentos PDF (Web y FTP), extracción automatizada con IA y consultas avanzadas.'
          />
          <meta
            name='keywords'
            content='HC-SCAN, Helpcopies Scan, ingesta PDF, inteligencia artificial, OCR documental, multitenancy, sincronización FTP, extracción de datos IA, SaaS empresarial'
          />
          <meta name='author' content='HC-SCAN Team' />
          <meta name='robots' content='index, follow' />

          {/* Open Graph / Facebook */}
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='HC-SCAN' />
          <meta property='og:title' content='HC-SCAN | Inteligencia Documental & Extracción con IA' />
          <meta
            property='og:description'
            content='Plataforma corporativa multitenant de almacenamiento e ingesta inteligente de documentos PDF con IA.'
          />
          <meta property='og:locale' content='es_ES' />

          {/* Twitter Card */}
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:title' content='HC-SCAN | Inteligencia Documental & Extracción con IA' />
          <meta
            name='twitter:description'
            content='Plataforma corporativa multitenant de almacenamiento e ingesta inteligente de documentos PDF con IA.'
          />

          {/* PWA Manifest & Mobile Configuration */}
          <link rel='manifest' href='/manifest.json' />
          <meta name='theme-color' content='#4F46E5' />
          <meta name='application-name' content='HC-SCAN' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
          <meta name='apple-mobile-web-app-title' content='HC-SCAN' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        (
          <App
            {...props} // @ts-ignore
            emotionCache={cache}
          />
        )
    })

  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map(style => {
    return (
      <style
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
      />
    )
  })

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
  }
}

export default CustomDocument
