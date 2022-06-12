export const BLIXO_API_CONFIGS = {
  items: {
    list: {
      url: 'items',
      method: 'GET',
      params: {
        page: 1,
        perPage: 10
      }
    },
    list: {
      url: 'items',
      method: 'GET',
      params: {
        page: 1,
        perPage: 10
      }
    },
  }
}

export const SHOPIFY_PRODUCT_TYPES = {
  subscription: 'SUBSCRIPTION',
  prePaidSubscription: 'PRE_PAID_SUBSCRIPTION',
  oneTimeAndSubscription: 'ONE_TIME_AND_SUBSCRIPTION',
  inactive: 'INACTIVE'
};

export const Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTIxNTU3NzUsImlhdCI6MTY1MjA2OTM3NSwic3ViIjoiNjE1YWQ3OWE5ZTIyMmIzMGIyMWM4OGJhIiwiaXNzIjoiNjE1YWQ4MTA5ZTIyMmIzMGIyMWM4OTAzIn0.EhPb6rbdgPMGKui_jJJ0w0aTr_XD8hgNbhKSGdqswx4'

export const LOCAL_CONFGIS = {
  baseUrl: 'http://localhost:13020/v1',
}

export const DEVELOPMENT_CONFIGS = {
  baseUrl: 'https://secure-develop.blixo.com/v1',
}

export const PRODUCTION_CONFIGS = {
  baseUrl: ''
}

export const APP_MODE = {
  local: 'local',
  dev: 'dev',
  production: 'production'
}

export const APP_CONFIGS = {
  [APP_MODE.local]: LOCAL_CONFGIS,
  [APP_MODE.dev]: DEVELOPMENT_CONFIGS,
  [APP_MODE.production]: PRODUCTION_CONFIGS,
}

