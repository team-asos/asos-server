import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ISwaggerConfig } from './interface';

export function setupSwagger(app: INestApplication, config: ISwaggerConfig) {
  const options = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.path, app, document, {
    swaggerOptions: {
      tagsSorter: (a: any, b: any) => {
        const tagsOrder = [
          'auth',
          'users',
          'reservations',
          'floors',
          'seats',
          'rooms',
          'facilities',
          'questions',
          'answers',
        ];
        let result = tagsOrder.indexOf(a) - tagsOrder.indexOf(b);

        if (result === 0) {
          result = a.localeCompare(b);
        }

        return result;
      },
      operationsSorter: (a: any, b: any) => {
        const methodsOrder = ['get', 'post', 'put', 'patch', 'delete'];
        let result =
          methodsOrder.indexOf(a.get('method')) -
          methodsOrder.indexOf(b.get('method'));

        if (result === 0) {
          result = a.get('path').localeCompare(b.get('path'));
        }

        return result;
      },
      defaultModelsExpandDepth: -1,
    },
  });
}
