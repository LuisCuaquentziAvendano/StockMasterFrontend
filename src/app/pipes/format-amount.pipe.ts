import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAmount',
  standalone: true
})
export class FormatAmountPipe implements PipeTransform {
  transform(value: string | number): string {
    const amount = parseFloat(value as string) / 100;
    return amount.toFixed(2);
  }
}