# NgxBusinessHoursScheduler

[![npm version](https://badge.fury.io/js/ngx-business-hours-scheduler.svg)](https://badge.fury.io/js/ngx-business-hours-scheduler)
[![License](https://img.shields.io/npm/l/local-package-publisher.svg)](https://github.com/debashish2014/local-package-publisher/blob/master/LICENSE)

An Angular component that allows you to show and manage business hours

![screenshots](https://raw.githubusercontent.com/alexsds/ngx-business-hours-scheduler/master/docs/screenshots/demo.png)

## Demo

https://ngx-business-hours-scheduler.web.app/

## Installation

To add the business hours to your Angular project:
```
npm install --save ngx-business-hours-scheduler
```

Once installed, add the business hours to your `app.module.ts`:
```typescript
import { NgxBusinessHoursSchedulerModule } from 'ngx-business-hours-scheduler';

...

@NgModule({
   ...
   imports: [
     ...
       NgxBusinessHoursSchedulerModule,
    ...
   ],
   ...
})
export class AppModule {}
```

## Sample usage

And in template file `app.component.html`:
```html
<ngx-business-hours-scheduler [(ngModel)]="businessHours"></ngx-business-hours-scheduler>
```

## License

Licensed under [MIT](http://www.opensource.org/licenses/mit-license.php)

Copyright &copy; 2021 [Alex Kovalenko](https://github.com/alexsds)
