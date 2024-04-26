import { Injector, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false,
})
export class FilterPipe implements PipeTransform {
  public constructor(private readonly injector: Injector) {}

  transform(
    value: Array<any>,
    callback: any,
    flags: { key: string; value: string }[]
  ): any {
    return value.filter((item) => !callback(item, flags));
  }
}
