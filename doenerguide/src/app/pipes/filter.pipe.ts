import { Injector, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false,
})
export class FilterPipe implements PipeTransform {
  public constructor() {}

  /**
   * Pipe to filter an array based on a callback function
   * @param value Value to be filtered
   * @param callback Callback function to filter the array
   * @param flags Flags on which the callback function should be called
   * @returns Filtered array
   */
  transform(value: Array<any>, callback: any, flags: { key: string; value: string }[]): any {
    return value.filter((item) => !callback(item, flags));
  }
}
