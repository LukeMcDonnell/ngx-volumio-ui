import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SocketService} from "../../service/socket.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnDestroy {
  public pageImage = null;
  public pageTitle = "Browse";
  public browse: Observable<any>;

  private $subs: Subscription[] = [];

  constructor(private route:ActivatedRoute, public socketService: SocketService) {
    this.route.data.subscribe(data => {
      this.pageTitle = data.title;
      this.socketService.emit('browseLibrary', {uri: data.root});
    });

    this.browse = this.socketService.getMessages('pushBrowseLibrary');

    this.$subs.push(
      this.socketService.getMessages('pushBrowseLibrary').subscribe((data: any) => {
        console.log(data);
        if (data.navigation.info) {
          this.pageTitle = data.navigation.info.title;
          this.pageImage = data.navigation.info.albumart;
        }
      })
    );
  }

  public getUri(uri): void {
    this.socketService.emit('browseLibrary', {uri: uri});
  }

  public getAlbumArt(albumart:string): string {
    if (!albumart) {
      // TODO: return a default image here?
      return null;
    }

    if (albumart.charAt(0) === '/') {
      return this.socketService.host + albumart
    }

    return albumart;
  }

  ngOnDestroy(): void {
    this.$subs.forEach((s)=>s.unsubscribe());
  }

}
