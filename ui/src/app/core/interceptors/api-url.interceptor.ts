import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ConfigService } from "../services";

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ConfigService);

  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  const apiReq = req.clone({
    url: config.getApiEndpoint(req.url)
  });

  return next(apiReq);
};
