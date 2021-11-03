import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ISwaggerConfig } from './interface';

export function setupSwagger(app: INestApplication, config: ISwaggerConfig) {
  const options = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.path, app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
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
