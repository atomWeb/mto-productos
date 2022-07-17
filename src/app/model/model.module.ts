import { NgModule } from '@angular/core';
// import { StaticDataSource } from './static.datasource';
import { Model } from './repository.model';
// import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { RestDataSource, REST_URL } from './rest.datasource';

@NgModule({
  // imports: [HttpClientModule, HttpClientJsonpModule],
  imports: [HttpClientModule],
  providers: [
    Model,
    // StaticDataSource,
    RestDataSource,
    {
      provide: REST_URL,
      useValue: `http://${location.hostname}:3500/products`,
    },
  ],
})
export class ModelModule {}

// JSONP can be used only to make GET requests, and it presents greater security risks
// than CORS. As a consequence, JSONP should be used only when CORS isn’t available.
// The Angular support for JSONP is defined in a feature module called:
// HttpClientJsonpModule,
