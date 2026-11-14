import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, OperatorFunction, catchError, throwError } from 'rxjs';
import { CreateProductDto, Product, UpdateProductDto } from '../core/types';
import { API_CONFIG, normalizeBaseUrl } from './api-config';
import { normalizeHttpError } from './http-error.util';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);
  private readonly resourceUrl = `${normalizeBaseUrl(this.config.baseUrl)}/products`;

  list(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.resourceUrl)
      .pipe(this.withErrorNormalization());
  }

  getById(id: string): Observable<Product> {
    return this.http
      .get<Product>(this.itemUrl(id))
      .pipe(this.withErrorNormalization());
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.http
      .post<Product>(this.resourceUrl, dto)
      .pipe(this.withErrorNormalization());
  }

  update(id: string, dto: UpdateProductDto): Observable<Product> {
    return this.http
      .patch<Product>(this.itemUrl(id), dto)
      .pipe(this.withErrorNormalization());
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<void>(this.itemUrl(id))
      .pipe(this.withErrorNormalization());
  }

  private itemUrl(id: string): string {
    return `${this.resourceUrl}/${encodeURIComponent(id)}`;
  }

  private withErrorNormalization<T>(): OperatorFunction<T, T> {
    return catchError<T, Observable<T>>((error: unknown) =>
      throwError(() => normalizeHttpError(error)),
    );
  }
}
