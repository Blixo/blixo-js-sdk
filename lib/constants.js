export const BLIXO_API_CONFIGS = {
  items: {
    list: {
      url: "items",
      method: "GET",
      params: {
        page: 1,
        perPage: 10,
      },
    },
    list: {
      url: "items",
      method: "GET",
      params: {
        page: 1,
        perPage: 10,
      },
    },
  },
};

export const SHOPIFY_PRODUCT_TYPES = {
  subscription: "SUBSCRIPTION",
  prePaidSubscription: "PRE_PAID_SUBSCRIPTION",
  oneTimeAndSubscription: "ONE_TIME_AND_SUBSCRIPTION",
  inactive: "INACTIVE",
};

export const Authorization =
  "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTIxNTU3NzUsImlhdCI6MTY1MjA2OTM3NSwic3ViIjoiNjE1YWQ3OWE5ZTIyMmIzMGIyMWM4OGJhIiwiaXNzIjoiNjE1YWQ4MTA5ZTIyMmIzMGIyMWM4OTAzIn0.EhPb6rbdgPMGKui_jJJ0w0aTr_XD8hgNbhKSGdqswx4";

export const LOCAL_CONFGIS = {
  baseUrl: "http://localhost:13020/v1",
  webUrl: "http://localhost:13000",
};

export const DEVELOPMENT_CONFIGS = {
  baseUrl: "https://api-develop.blixo.com/v1",
  webUrl: "https://secure-develop.blixo.com",
};

export const STAGING_CONFIGS = {
  baseUrl: "https://api-staging.blixo.com/v1",
  webUrl: "https://secure-staging.blixo.com",
};

export const PRODUCTION_CONFIGS = {
  baseUrl: "https://api.blixo.com/v1",
  webUrl: "https://secure.blixo.com",
};

export const APP_MODE = {
  local: "local",
  development: "development",
  staging: "staging",
  production: "production",
};

export const APP_CONFIGS = {
  [APP_MODE.local]: LOCAL_CONFGIS,
  [APP_MODE.development]: DEVELOPMENT_CONFIGS,
  [APP_MODE.staging]: STAGING_CONFIGS,
  [APP_MODE.production]: PRODUCTION_CONFIGS,
};
