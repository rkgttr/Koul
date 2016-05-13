'use strict';

/**
 *
 * Main Application
 *
 **/
class App_koul {
  constructor() {
      this.WIN = $(window);
      this.DOC = $(document);
      this.BODY = $('body');
      this.HTML = $('html');
      this.INITED = false;
      if (App_koul.instance !== undefined) {
        return App_koul.instance;
      } else {
        App_koul.instance = this;
      }
      return this;
    }
    /**
     *
     * Singleton thing
     *
     **/
  static getInstance() {
      if (App_koul.instance === undefined) {
        new App_koul();
      }
      return App_koul.instance;
    }
    /**
     *
     * Initialize your app, surcharge with whatever needed
     *
     **/
  init() {
    if (!this.INITED) {
      this.INITED = true;
      this.addListeners();
      this.accents = [];
    }
  }

  /**
   *
   * Event Listeners, surcharge with whatever needed
   *
   **/
  addListeners() {
    let dom = $('.color-picker'),
      colorTile = $('.color-picker .color'),
      h3 = $('h5, h4'),
      R = $('#R'),
      G = $('#G'),
      B = $('#B'),
      A = $('#A'),
      hexInput = $('#hex'),
      updateTile = () => {
        let primary = this.rgb2hex([R.val(), G.val(), B.val()]),
          compl = this.rgbToHsl(R.val(), G.val(), B.val()),
          accent1 = this.rgb2hex(this.hslToRgb(((compl[0] * 360) + 180 > 360 ? ((compl[0] * 360) + 180) - 360 : (compl[0] * 360) + 180) / 360, compl[1], compl[2])),
          accent2 = this.rgb2hex(this.hslToRgb(((compl[0] * 360) + 150 > 360 ? ((compl[0] * 360) + 150) - 360 : (compl[0] * 360) + 150) / 360, compl[1], compl[2])),
          accent3 = this.rgb2hex(this.hslToRgb(((compl[0] * 360) + 210 > 360 ? ((compl[0] * 360) + 210) - 360 : (compl[0] * 360) + 210) / 360, compl[1], compl[2])),
          accent4 = this.rgb2hex(this.hslToRgb(((compl[0] * 360) + 30 > 360 ? ((compl[0] * 360) + 30) - 360 : (compl[0] * 360) + 30) / 360, compl[1], compl[2])),
          accent5 = this.rgb2hex(this.hslToRgb(((compl[0] * 360) + 330 > 360 ? ((compl[0] * 360) + 330) - 360 : (compl[0] * 360) + 330) / 360, compl[1], compl[2])),
          black = this.rgb2hex(this.blendOver([R.val(), G.val(), B.val()], [32, 32, 32], $('#A').val() * .01)),
          dark = this.rgb2hex(this.blendOver([R.val(), G.val(), B.val()], [66, 66, 66], $('#A').val() * .01)),
          light = this.rgb2hex(this.blendOver([R.val(), G.val(), B.val()], [205, 205, 205], $('#A').val() * .01)),
          white = this.rgb2hex(this.blendOver([R.val(), G.val(), B.val()], [250, 250, 250], $('#A').val() * .01)),
          p_dark = this.colorLum(primary, -.2),
          p_light = this.colorLum(primary, .2);


        colorTile.css('background', primary).data('hex', primary);;
        h3.css('color', this.rgb2hex([R.val(), G.val(), B.val()]));
        $('.accent:nth-child(1)').css('background', accent1).data('hex', accent1);
        $('.accent:nth-child(2)').css('background', accent2).data('hex', accent2);
        $('.accent:nth-child(3)').css('background', accent3).data('hex', accent3);
        $('.accent:nth-child(4)').css('background', accent4).data('hex', accent4);
        $('.accent:nth-child(5)').css('background', accent5).data('hex', accent5);
        $('.black').css('background', black).data('hex', black);
        $('.dark').css('background', dark).data('hex', dark);
        $('.light').css('background', light).data('hex', light);
        $('.white').css('background', white).data('hex', white);
        $('.color .lighter').css('background', p_light).data('hex', p_light);
        $('.color .darken').css('background', p_dark).data('hex', p_dark);
        this.updateAccents();
        this.updateScss();
      },
      updateSlider = (rgb) => {
        R.val(rgb[0]);
        G.val(rgb[1]);
        B.val(rgb[2]);
      },
      updateHex = () => {
        hexInput.val(this.rgb2hex([R.val(), G.val(), B.val()]));
      };
    R.on('change', () => {
      updateTile();
      updateHex();
    });
    A.on('change', () => {
      updateTile();
    });
    G.on('change', () => {
      updateTile();
      updateHex();
    });
    B.on('change', () => {
      updateTile();
      updateHex();
    });
    $('.accent').on('click', (e) => {
      if (!this.accents) {
        this.accents = [];
      }
      $(e.target).toggleClass('selected');
      if ($(e.target).hasClass('selected')) {
        this.accents.push($(e.target));
      } else {
        this.accents.forEach((accent, index) => {
          if (accent.is(e.target)) {
            this.accents.splice(index, 1);
          }
        });
      }
      if (this.accents.length > 3) {
        this.accents[0].removeClass('selected');
        this.accents.shift();
      }
      this.updateAccents();
    });
    hexInput.on('input', (e) => {
      if (/^#[0-9A-F]{6}$/i.test($(e.target).val())) {
        updateSlider(this.hex2rgb($(e.target).val()));
        updateTile();
      }
    });


    updateTile();

  }

  updateScss() {
    var str = `$primary: ${$('.palette .color').data('hex')};<br>
                $primary_light: ${$('.color .lighter').data('hex')};<br>
                $primary_dark: ${$('.color .darken').data('hex')};<br>
                $black: ${$('.black').data('hex')};<br>
                $dark: ${$('.dark').data('hex')};<br>
                $light: ${$('.light').data('hex')};<br>
                $white: ${$('.white').data('hex')};<br>`;
    this.accents.forEach((accent, index) => {
      str += `$accent_${index}: ${accent.data('hex')};<br>
              $accent_${index}_light: ${$('.extra._'+index+' .lighter').data('hex')};<br>
              $accent_${index}_dark: ${$('.extra._'+index+' .darken').data('hex')};<br>`;
    });
    $('code').html(str);
  }

  updateAccents() {
    $('.extra').hide();
    if (!this.accents) {
      this.accents = [];
    }
    this.accents.forEach((accent, index) => {
      let c = accent.data('hex');
      $('.extra._' + index).css({ 'display': 'flex', 'background': c });
      $('.extra._' + index + ' .lighter').css('background', this.colorLum(c, .2)).data('hex', this.colorLum(c, .2));
      $('.extra._' + index + ' .darken').css('background', this.colorLum(c, -.2)).data('hex', this.colorLum(c, -.2));
    });
    this.updateScss();
  }

  colorLum(hex, lum) {

    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    let rgb = "#",
      c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }

    return rgb;
  }

  blendOver(base, bg, alpha) {
    return base.map((channel, index) =>
      ~~(((bg[index] < 127 ? 255 * (2 * (channel / 255) * (bg[index] / 255)) : 255 * ((1 - 2 * (1 - (bg[index] / 255)) * (1 - (channel / 255))))) * alpha) + (bg[index] * (1 - alpha)))
    );
  }

  rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      h, s, l = (max + min) * .5;

    if (max === min) {
      h = s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }
  hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      let hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s,
        p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [~~(r * 255), ~~(g * 255), ~~(b * 255)];
  }
  paddedHex(n) {
    let h = (Number(n) < 10) ? '0' : '';
    h += Number(n).toString(16);
    return (h.length === 1) ? ('0' + h) : h;
  }
  hex2rgb(hex) {
    hex = hex.replace(/ |#/g, '');
    if (hex.length === 3) {
      hex = hex.replace(/(.)/g, '$1$1');
    }

    hex = hex.match(/../g);
    return [parseInt(hex[0], 16), parseInt(hex[1], 16), parseInt(hex[2], 16)];
  }
  rgb2hex(rgb) {
    let r = this.paddedHex(rgb[0]),
      g = (rgb[1] !== undefined) ? this.paddedHex(rgb[1]) : r,
      b = (rgb[2] !== undefined) ? this.paddedHex(rgb[2]) : r;
    return '#' + r + g + b;
  }
}
App_koul.instance = undefined;

/**
 *
 * Launch the application
 *
 **/
App_koul.getInstance().init();
