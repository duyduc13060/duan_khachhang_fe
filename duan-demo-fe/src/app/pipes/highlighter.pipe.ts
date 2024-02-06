import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlighter'
})
export class HighlighterPipe implements PipeTransform {

  transform(value: string, args: string): any {
    if (!args) { return value; }
    const re = new RegExp(args, 'gi');
    return value.replace(re, "<span class='highlighted-text'>$&</span>");
  }

}
