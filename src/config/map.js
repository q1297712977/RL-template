(function(h) {
    window.AMapTools = function() {
        var self = this;
        var args = arguments;
        var $div = null;
        var options = {};
        var completeCallBack = null;
        if (args.length == 1) {
            if (typeof args[0] == 'string') {
                $div = args[0];
            } else {
                options = args[0];
            }
        } else if (args.length >= 2) {
            $div = args[0];
            if ('object' == typeof args[1]) {
                options = args[1];
                completeCallBack = args[2];
            } else if ('function' == typeof args[1]) {
                completeCallBack = args[1];
            }
        }
        var mapObj = null,
            overlays = {},
            infoWindow = new h.InfoWindow({
                closeWhenClickMap: true,
                autoMove: true,
                isCustom: true,
                offset: new h.Pixel(0, -40)
            }),
            cluster = null,
            toolbar = null,
            mousetool = null,
            mouseEvent = null,
            overview = null,
            scale = null,
            markerMovingControl = null;
        var listenerEvents = null;
        this.overlayTypeCode = {
            '0': 'Rectangle',
            0: 'Rectangle',
            'Rectangle': 0,
            '1': 'Circle',
            1: 'Circle',
            'Circle': 1,
            '2': 'Polygon',
            2: 'Polygon',
            'Polygon': 2,
            '6': 'Polyline',
            6: 'Polyline',
            'Polyline': 6,
            '4': 'Marker',
            4: 'Marker',
            'Marker': 4
        };
        this.overlayTypeName = {
            0: '鐭╁舰',
            '0': '鐭╁舰',
            'rectangle': '鐭╁舰',
            'Rectangle': '鐭╁舰',
            1: '鍦嗗舰',
            '1': '鍦嗗舰',
            'circle': '鍦嗗舰',
            'Circle': '鍦嗗舰',
            2: '澶氳竟褰�',
            '2': '澶氳竟褰�',
            'polygon': '澶氳竟褰�',
            'Polygon': '澶氳竟褰�',
            6: '绾胯矾',
            '6': '绾胯矾',
            'polyline': '绾胯矾',
            'Polyline': '绾胯矾',
            4: '绔欑偣',
            '4': '绔欑偣',
            'marker': '绔欑偣',
            'Marker': '绔欑偣'
        };
        var infoWindowArr = {};
        var mapId = $div || 'map';
        var initMap = function() {
            var opt = {
                zoom: 2,
                resizeEnable: true,
            }; !!index.city && (opt.center = index.city.location);
            if (options) {
                $.extend(opt, options);
            }
            listenerEvents = {};
            mapObj = new h.Map(mapId, opt);
            mapObj.plugin(['AMap.ToolBar', 'AMap.MouseTool', 'AMap.OverView', 'AMap.Scale'], function() {
                // 鍔犺浇宸ュ叿鏉�
                if (opt.toolbar == undefined || opt.toolbar == true) {
                    toolbar = new h.ToolBar({
                        direction: opt.direction != undefined ? opt.direction : true,
                        ruler: opt.ruler != undefined ? opt.ruler : true,
                        autoPosition: opt.autoPosition != undefined ? opt.autoPosition : false,
                        locationMarker: opt.locationMarker != undefined ? opt.locationMarker : false,
                        offset: new h.Pixel(options.toolbarOffsetx || 0, options.toolbarOffsety || 0)
                    });
                    mapObj.addControl(toolbar);
                }
                if (opt.MouseTool) {
                    mousetool = new h.MouseTool(mapObj);
                }
                if (opt.OverView) {
                    overview = new h.OverView();
                    mapObj.addControl(overview);
                }
                if (opt.Scale) {
                    scale = new h.Scale();
                    mapObj.addControl(scale);
                }
            });
            'function' == typeof completeCallBack && AMap.event.addListener(mapObj, 'complete', completeCallBack);
            $('img.amap-logo').remove();
            $('div.amap-copyright').remove();
        };
        initMap();
        this.setToolBarOffset = function(offset) {
            if (toolbar != undefined && offset instanceof h.Pixel) {
                toolbar.setOffset(offset);
            }
        };
        this.setZoom = function(zoom) {
            mapObj.setZoom(zoom);
        }
		/**
		 * 鐐硅仛鍚�
		 * @method markerCluster
		 * @param {Array} markers
		 * @return {AMap.MarkerClusterer} cluster 鑱氬悎瀵硅薄
		 */
        this.markerCluster = function(markers) {
            if (cluster && cluster instanceof h.MarkerClusterer) {
                cluster.setMarkers(markers);
            } else {
                mapObj.plugin(['AMap.MarkerClusterer'], function() {
                    cluster = new h.MarkerClusterer(mapObj, markers, {
                        averageCenter: true,
                        maxZoom: 11,
                        minClusterSize: 2,
                        gridSize: 30
                    });
                });
            }
        };
		/**
		 * 鍚戝湴鍥惧鍔犵偣
		 * @param {Object} lnglat
		 * @param {Object} opt="{id:id,content:content,custom:true,otherAttr:otherAttr,width:,height:}"
		 */
        this.addMarker = function(lnglat, options) {
            options = options || {};
            if (typeof lnglat == 'string') {
                var lng = lnglat.split(',')[0];
                var lat = lnglat.split(',')[1];
                lnglat = new h.LngLat(lng, lat);
            } else if ($.isArray(lnglat)) {
                lnglat = new h.LngLat(lnglat[0], lnglat[1]);
            } else if (typeof lnglat == 'object') {
                lnglat = new h.LngLat(lnglat.lng, lnglat.lat);
            }
            var id = options.id || 'jrad-marker-' + $.uuid;
            if (overlays.hasOwnProperty(id)) {
                overlays[id].setMap(null);
                delete overlays[id];
            }
            var offset = options.offset != undefined || options.offset === false ? options.offset : new h.Pixel(-11.5, -32);
            var opt = {
                id: id,
                // marker id
                position: lnglat,
                // 浣嶇疆
                offset: offset,
                // 鍩虹偣涓哄浘鐗囧乏涓婅锛岃缃浉瀵瑰熀鐐圭殑鍥剧墖浣嶇疆鍋忕Щ閲忥紝鍚戝乏鍚戜笅涓鸿礋
                topWhenClick: options.topWhenClick != undefined ? options.topWhenClick : true,
                topWhenMouseOver: options.topWhenMouseOver != undefined ? options.topWhenMouseOver : true,
                visible: options.visible != undefined ? options.visible : true,
                // 鍙
                zIndex: options.zIndex != undefined ? options.zIndex : 1,
                // 璁剧疆鐐瑰彔鍔犻『搴忥紝鍦ㄥ姞杞藉涓偣鏈夋晥鏋滐紝璇﹁璁剧疆鐐瑰彔鍔犻『搴忕ず渚�
                title: options.title,
                draggable: options.draggable || false,
                autoRotation: options.autoRotation != undefined ? options.autoRotation : true,
            };
            if (options.markerClass) {
                opt.content = $('<div class="' + options.markerClass + '"></div>')[0];
            } else if (options.icon) {
                opt.icon = options.icon;
            } else if (options.markerContent) {
                'string' == typeof options.markerContent && (options.markerContent = $(options.markerContent)[0]);
                opt.content = options.markerContent;
            } else {
                opt.content = $('<div class="defaultMarker"></div>')[0];
            }
            var m = new h.Marker(opt);
            if (options.extData != undefined) {
                m.setExtData(options.extData);
            }
            if (options.autoTop) {
                h.event.addListener(m, 'mouseover', function() {
                    m.setTop(true);
                    var content = m.getContent();
                    'object' == typeof content && $(content).parent().addClass('highlight');
                });
                h.event.addListener(m, 'mouseout', function() {
                    m.setTop(false);
                    var content = m.getContent();
                    'object' == typeof content && $(content).parent().removeClass('highlight');
                });
            }
            if (options.content) {
                m.infoWindow = infoWindow;
                h.event.addListener(m, 'click', function(e) {
                    var content = m.getContent();
                    if (!mapObj.getBounds().contains(m.getPosition())) {
                        mapObj.panTo(m.getPosition());
                    }
                    if ('object' == typeof content && $(content).is(':hidden')) {
                        return;
                    }
                    if (typeof options.content == 'function') {
                        options.content.apply(infoWindow, [e, m]);
                    } else {
                        infoWindow.setContent(options.content);
                        if (options.winOffset instanceof h.Pixel) {
                            infoWindow.set('offset', options.winOffset);
                        }
                    }
                    infoWindow.open(mapObj, m.getPosition());
                    if ($.isFunction(options.click)) {
                        e.infoWindow = infoWindow;
                        options.click.apply(m, [e]);
                    }
                });
            }
            overlays[id] = m;
            if (options.isShow == undefined || options.isShow == true) {
                m.setMap(mapObj);
            }
            return m;
        };
		/**
		 * 娣诲姞绾�
		 * @param markerArry
		 * @returns
		 */
        this.addPolyline = function(lnglats, opt) {
            opt = opt || {}, lnglats = lnglats || [];
            var id = opt.id || 'jrad-polyline-' + $.uuid;
            path = [];
            if (overlays.hasOwnProperty(id)) {
                overlays[id].setMap(null);
                delete overlays[id];
            }
            $.each(lnglats, function(i, item) {
                if (typeof item == 'string') {
                    var lnglat = item.split(',');
                    path.push(new h.LngLat(lnglat[0], lnglat[1]));
                } else if (item instanceof h.LngLat) {
                    path.push(item);
                }
            });
            opt.id = id;
            opt = $.extend({
                path: path,
                strokeColor: '#7A98DD',
                //绾块鑹�
                strokeOpacity: 1,
                //绾块€忔槑搴�
                strokeWeight: 3,
                //绾垮
                strokeDasharray: [10, 5] //琛ュ厖绾挎牱寮�
            }, opt);
            var polyline = new h.Polyline(opt);
            overlays[id] = polyline;
            polyline.setMap(mapObj);
            return polyline;
        };
		/**
		 * 鏍规嵁overlayId鏂板淇℃伅绐楀彛鍒板叏灞€鍙橀噺infoWindow
		 * @param {Object} id
		 * @param {Object} options
		 * @example {content: '',custome: true,autoMove: true,}
		 */
        this.newInfoWindow = function(id, options) {
            var that = this,
                _infoWindow = new h.InfoWindow({
                    closeWhenClickMap: true,
                    autoMove: true,
                    offset: options.winOffset || new h.Pixel(0, -40),
                    isCustom: options.isCustom !== undefined ? options.isCustom : true,
                    content: options.content
                }),
                id = id || 'jrad-overlay-' + $.uuid,
                m = this.getOverlaysById(id);
            if (m) {
                h.event.addListener(m, 'click', function(e) {
                    _infoWindow.open(mapObj, that.getOverlayCenter(m));
                    if (!mapObj.getBounds().contains(m.getPosition())) {
                        mapObj.panTo(m.getPosition());
                    } else {
                        // 璁＄畻绐椾綋鏄惁鍦╩ap鏄剧ず鍖哄煙鍐�
                        var size = mapObj.getSize();
                        var _width = size.width;
                        var _height = size.height;
                        var winSize = _infoWindow.getSize();
                        var _winWidth = winSize.getWidth() / 2;
                        var _winHeight = winSize.getHeight() || _infoWindow.getContent().offsetHeight;
                        var pixel = mapObj.lnglatTocontainer(m.getPosition());
                        var px = pixel.x;
                        var py = pixel.y;
                        var $details = $('.bottom-wrap');
                        if ($details.hasClass('show-wrap')) {
                            _height -= $details.outerHeight();
                        }
                        if (px < _winWidth || (_width - px < _winWidth) || py < _winHeight - 50 || (_height - py < 100)) {
                            mapObj.panTo(m.getPosition());
                        }
                    }
                    if ($.isFunction(options.click)) {
                        e.infoWindow = _infoWindow;
                        options.click.apply(m, [e]);
                    }
                });
                if (m.infoWindow) {
                    m.infoWindow.setMap(null);
                    delete m.infoWindow;
                }
                m.infoWindow = _infoWindow;
                infoWindowArr[id] = _infoWindow;
            }
            return _infoWindow;
        };
		/**
		 * 鏇存柊绐楀彛淇℃伅
		 */
        this.updateInfoWindow = function(id, opts) {
            var _infoWindow = infoWindowArr[id] || infoWindow;
            var m = this.getOverlaysById(id);
            if (_infoWindow instanceof h.InfoWindow) {
                if (opts.custome !== undefined) {
                    _infoWindow.setIsCustom(opts.custome);
                }
                if (opts.content !== undefined) {
                    _infoWindow.setContent(opts.content);
                    $(opts.content).delegate('a.pop-up-close', 'click', function(event) {
                        _infoWindow.close();
                        if ($.isFunction(opts.close)) {
                            opts.close.apply(this, [event, m, _infoWindow]);
                        }
                    });
                }
                if (opts.offset instanceof h.Pixel) {
                    _infoWindow.a.offset = opts.offset;
                }
                if (_infoWindow.getIsOpen() && m) {
                    _infoWindow.open(mapObj, this.getOverlayCenter(m));
                } else {
                    _infoWindow.close();
                }
                return _infoWindow;
            }
        };
		/**
		 * 鍏抽棴鎸囧畾娑堟伅绐椾綋锛宨d涓簄ull鏃跺叧闂叏閮ㄧ獥浣�
		 * @param {} ovlerayId
		 */
        this.closeInfoWindow = function(id) {
            if (id !== undefined && id !== '') {
                if (infoWindowArr[id]) {
                    infoWindowArr[id].close();
                }
            } else {
                mapObj.clearInfoWindow();
            }
        };
		/**
		 * 鏇存柊鐐�
		 * @param {Object|String} m 鐐瑰璞鐐笽D
		 * @param {Object} {icon 鍥剧墖,lnglat 鍦板潃,markerClass 鍥炬爣,zIndex z搴� }
		 */
        this.updateMarker = function(m, options) {
            typeof m == 'string' && (m = this.getOverlaysById(m));
            if (!m) {
                return;
            }
            if (options.icon != undefined && (options.icon instanceof h.Icon || typeof options.icon == 'string')) {
                m.setIcon(options.icon);
            }
            if (options.markerClass != undefined) {
                m.setContent($('<div class="' + options.markerClass + '"></div>')[0]);
            }
            if (options.markerContent != undefined) {
                'string' == typeof options.markerContent && (options.markerContent = $(options.markerContent)[0]);
                m.setContent(options.markerContent);
            }
            if (options.pixelX != undefined && options.pixelY != undefined) {
                options.offset = new h.Pixel(options.pixelX, options.pixelY);
            }
            if (options.offset != undefined && options.offset instanceof h.Pixel) {
                m.setOffset(options.offset);
            }
            if (options.lnglat != undefined && options.lnglat instanceof h.LngLat) {
                m.setPosition(options.lnglat);
            }
            if (options.zIndex != undefined) {
                m.setzIndex(options.zIndex);
            }
            if (options.autoRotation != undefined) {
                m.set('autoRotation', options.autoRotation); !options.autoRotation && (options.angle = 0);
            }
            if (options.angle != undefined) {
                m.setAngle(options.angle);
            }
            return m;
        };
		/**
		 *鏇存柊绾挎
		 * @param {Object} line 绾垮璞�
		 * @param {Object} lnglat 鍧愭爣瀵硅薄
		 */
        this.updateLine = function(line, lnglat) {
            var path = line.getPath();
            path.push(lnglat);
            line.setPath(path);
            line.setMap(mapObj);
            //mapObj.updateOverlay(line);
        };
        this.contains = function(lngLat) {
            return mapObj.getBounds().contains(lngLat);
        };
		/**
		 * 缁戝畾浜嬩欢
		 * @param {Object|String} overlay 瀵硅薄|瀵硅薄id|"map"
		 * @param {String} eventName 浜嬩欢鍚嶇О
		 * @param {Function} func 鍥炶皟鍑芥暟
		 * @param {Object|String} context 瑙﹀彂瀵硅薄 func涓璽his鎸囦唬瀵硅薄锛屾湭璁剧疆鏃堕粯璁verlay
		 */
        this.bindOverlayEvent = function(overlay, eventName, func, context) {
            if (overlay != undefined) {
                var isMap = 'map';
                if (typeof overlay == 'string') {
                    if (isMap.indexOf(overlay.toLocaleLowerCase()) != -1) {
                        isMap = true;
                        overlay = mapObj;
                    } else {
                        isMap = false;
                        overlay = this.getOverlaysById(overlay) || undefined;
                    }
                }
                if (typeof context == 'string') {
                    if (isMap.indexOf(context.toLocaleLowerCase()) != -1) {
                        isMap = true;
                        context = mapObj;
                    } else {
                        isMap = false;
                        context = this.getOverlaysById(context) || undefined;
                    }
                }
                var id = isMap ? 'map' : overlay.get('id');
                listenerEvents[id] = h.event.addListener(overlay, eventName, function(e) {
                    func.apply(this, [e]);
                }, context);
                return listenerEvents[id];
            }
        };
        this.bind = this.bindOverlayEvent;
		/**
		 * 鏍规嵁ID 瑙ｇ粦浜嬩欢
		 * @param {} id 鏍囨敞鐗﹊d
		 */
        this.removeListener = function(id) {
            if (listenerEvents.hasOwnProperty(id) && listenerEvents[id] != undefined) {
                h.event.removeListener(listenerEvents[id]);
                delete listenerEvents[id];
            }
        };
		/**
		 * 瑙﹀彂缁戝畾浜嬩欢
		 * @param {Object|String} overlay 瀵硅薄|瀵硅薄id
		 * @param {String} eventName 瑙﹀彂缁戝畾鍑芥暟
		 * @param {Object} args 鍙傛暟
		 */
        this.trigger = function(overlay, eventName, args) {
            if (overlay != undefined) {
                eventName = eventName || 'click';
                if (typeof overlay == 'string') {
                    overlay = this.getOverlaysById(overlay);
                }
                if (overlay) {
                    h.event.trigger(overlay, eventName, args);
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };
		/**
		 * 娓呯┖鍦板浘鎿嶄綔
		 */
        this.clearMap = function() { // 娓呯┖鍦板浘
            for (var p in overlays) overlays.hasOwnProperty(p) && overlays[p] != undefined && delete overlays[p];
            cluster && cluster.clearMarkers();
            mapObj.clearMap();
        };
		/**
		 * 璁剧疆榧犳爣宸ュ叿涓虹Щ鍔�
		 */
        this.setMouseMove = function() {
            mousetool.close(true);
            if (editor) {
                editor._circle && editor._circle.setMap(null), editor._poly && editor._poly.setMap(null), editor.close();
                editor = null;
            }
        };
		/**
		 * 鏍规嵁浼犲叆鐨勭被鍨嬭缃紶鏍囧伐鍏�
		 * @param {String} type like "Polygon"
		 * @param {Object} func 榧犳爣缁樼敾鎴愬姛鍚庣殑鍥炶皟鍑芥暟
		 */
        var editor;
        this.setArea = function(type, callback) {
            mousetool.close(true);
            if (editor) {
                editor._circle && editor._circle.setMap(null), editor._poly && editor._poly.setMap(null), editor.close();
                editor = null;
            }
            switch (type) {
                case 'Polygon':
                    mousetool.polygon({
                        id: 'jrad-over-editor',
                        strokeColor: '#046788',
                        strokeOpacity: 0.6,
                        strokeWeight: 3,
                        fillColor: '#046788',
                        fillOpacity: 0.2
                    });
                    break;
                case 'Rectangle':
                    mousetool.rectangle({
                        id: 'jrad-over-editor',
                        strokeColor: '#046788',
                        strokeOpacity: 0.6,
                        strokeWeight: 3,
                        fillColor: '#046788',
                        fillOpacity: 0.2
                    });
                    break;
                case 'Circle':
                    mousetool.circle({
                        id: 'jrad-over-editor',
                        strokeColor: '#046788',
                        strokeOpacity: 0.6,
                        strokeWeight: 3,
                        fillColor: '#046788',
                        fillOpacity: 0.2
                    });
                    break;
                case 'Polyline':
                    mousetool.polyline({
                        id: 'jrad-over-editor',
                        strokeColor: '#046788',
                        strokeOpacity: 0.6,
                        strokeWeight: 3
                    });
                    break;
                //鍚夋灄鍏呯數绔欎笓鐢�
                case 'MarkerChar':
                    mousetool.marker({
                        id: 'jrad-over-editor',
                        content: '<div class="defaultMarker"></div>',
                        offset: new h.Pixel(7, 2),
                        draggable: true // 鍙嫋鍔�
                    });
                    break;
                case 'Marker':
                    mousetool.marker({
                        id: 'jrad-over-editor',
                        content: '<div class="defaultMarker"></div>',
                        offset: new h.Pixel(-11.5, -32),
                        draggable: true // 鍙嫋鍔�
                    });
                    break;
                case 'Ruler':
                    mousetool.rule();
                    break;
                default:
                    mousetool.close();
            }
            if (mouseEvent != undefined) {
                h.event.removeListener(mouseEvent);
                mouseEvent = undefined;
            }
            mouseEvent = h.event.addListener(mousetool, 'draw', function(e) {
                mousetool.close();
                h.event.removeListener(mouseEvent);
                switch (type) {
                    case 'Circle':
                        mapObj.plugin(['AMap.CircleEditor'], function() {
                            editor = new h.CircleEditor(mapObj, e.obj);
                            editor.getOverlay = function() {
                                return e.obj;
                            };
                            editor.open();
                            if ($.isFunction(callback)) {
                                callback.apply(e.obj, [type, editor]);
                            }
                        });
                        break;
                    case 'Polygon':
                    case 'Polyline':
                    case 'Rectangle':
                        mapObj.plugin(['AMap.PolyEditor'], function() {
                            editor = new h.PolyEditor(mapObj, e.obj);
                            editor.getOverlay = function() {
                                return e.obj;
                            };
                            editor.open();
                            if ($.isFunction(callback)) {
                                callback.apply(e.obj, [type, editor]);
                            }
                        });
                        break;
                    default:
                        if ($.isFunction(callback)) {
                            callback.apply(e.obj, [type, mousetool]);
                        }
                }
            });
        };
		/**
		 * 鏍规嵁瑕嗙洊鐗╃被鍨嬫竻绌鸿鐩栫墿
		 * @param {String} overlayType
		 */
        this.clearByType = function(overlayType) {
            var type = 'Marker,Polyline,Polygon,Circle';
            if (type.indexOf(overlayType) == -1) {
                throw new Error('鍙犲姞鐗╃被鍨嬩负' + type + '涓殑涓€涓�');
                return false;
            }
            if (type.indexOf(',') != -1) {
                type = type.split(',');
            } else {
                type = [type];
            }
            for (var i = 0; i < type.length; i++) {
                var className = type[i];
                if (h[className]) {
                    for (var id in overlays) {
                        var o = overlays[id];
                        if (o instanceof h[className]) {
                            o.setMap(null);
                            if (o instanceof h.Marker && cluster && cluster instanceof h.MarkerClusterer) {
                                cluster.removeMarker(o);
                            }
                            delete overlays[id];
                        }
                    }
                }
            }
        };
		/**
		 * 澶氱偣瑙勫垝璺緞
		 * @param {Object} array
		 * @param {Object} callback
		 */
        this.roueSearchMultiPoi = function(array, callback) {
            var mrs = new h.RouteSearch();
            var opt = {};
            opt.per = 150;
            // 鎶藉惛鍑芥暟锛岃〃绀哄湪鍦板浘涓婄敾瀵艰埅璺緞鐨勭珯鐐圭殑涓暟,榛樿涓�150
            opt.routeType = 0;
            // 璺緞璁＄畻瑙勫垯,0琛ㄧず閫熷害浼樺厛锛堥粯璁わ級
            var arr = new Array();
            for (var i = 0; i < array.length; i++) {
                var mll = new h.LngLat(arry[i]);
                arr.push(mll);
            }
            callback = callback ? callback : function(data) {
                switch (data.message) {
                    case 'ok':
                        var coors = [];
                        var segmengList = data.segmengList;
                        var listlength = segmengList.length;
                        for (var i = 0; i < listlength; i++) {
                            var coor = segmengList[i].coor;
                            coors.push(coor);
                        }
                        var coorArray = coors.split(',');
                        var lnglatArray = [];
                        var coorlength = coorArray.length;
                        if (coorArray[coorlength - 1] == '') {
                            coorArray.slice(0, coorlength - 1);
                        }
                        for (var i = 0; i < coorlength - 2; i = i + 2) {
                            lnglatArray.push(coorArray[i] + ',' + coorArray[i + 1]);
                        }
                }
            };
            mrs.getNaviPath(arr, callback);
        };
		/**
		 * 鏍规嵁鍩庡競鍚嶇О,鍖哄幙鍚嶇О,鐪佷唤鍚嶇О,鍖哄彿杩涜鍦板浘瀹氫綅
		 * @param {String} name
		 * @param {Function} callback
		 */
        this.setCity = function(name, callback) {
            mapObj.setCity(name, callback);
        };
        this.fixBounds = function(arr) {
            var min_lat = 0;
            var max_lat = 0;
            var min_lng = 0;
            var max_lng = 0;
            $.each(arr, function(index, val) {
                if (min_lat == 0) {
                    min_lat = val.lat;
                }
                if (max_lat == 0) {
                    max_lat = val.lat;
                }
                if (min_lng == 0) {
                    min_lng = val.lng;
                }
                if (max_lng == 0) {
                    max_lng = val.lng;
                }
                if (min_lat > val.lat) {
                    min_lat = val.lat;
                }
                if (max_lat < val.lat) {
                    max_lat = val.lat;
                }
                if (min_lng > val.lng) {
                    min_lng = val.lng;
                }
                if (max_lng < val.lng) {
                    max_lng = val.lng;
                }
            });
            var southwest = new h.LngLat(min_lng - 5, min_lat - 5);
            var northeast = new h.LngLat(max_lng + 5, max_lat + 5);
            var bounds = new h.Bounds(southwest, northeast);
            mapObj.setBounds(bounds);
        };
        this.setBounds = function(bounds) {
            if ($.isArray(bounds)) {
                var southwest = new h.LngLat(bounds[0].lng, bounds[0].lat);
                var northeast = new h.LngLat(bounds[1].lng, bounds[1].lat);
                bounds = new h.Bounds(southwest, northeast);
            }
            if (bounds instanceof h.Bounds) {
                mapObj.setBounds(bounds);
            }
        };
        this.getBounds = function() {
            var bounds = mapObj.getBounds();
            return bounds.southwest.lng + ',' + bounds.southwest.lat + ';' + bounds.northeast.lng + ',' + bounds.northeast.lat;
        };
		/**
		 *绉诲姩鍦板浘涓績鍒板浘鏍囨墍鍦ㄤ綅缃�
		 * @param {Marker}
		 */
        this.mapPanto = function(overlay) {
            mapObj.panTo(overlay.getPosition());
        };
		/**
		 * 璁剧疆鍦板浘涓績鐐�
		 * @param {} lnglat
		 */
        this.setCenter = function(lnglat) {
            lnglat = new h.LngLat(lnglat.lng, lnglat.lat);
            mapObj.setCenter(lnglat);
        };
		/**
		 * 鑾峰彇鍦板浘涓績鐐�
		 * @return {}
		 */
        this.getCenter = function() {
            return mapObj.getCenter();
        };
		/**
		 * 閫氳繃鏍囨敞鏍囪瘑鑾峰彇鏍囨敞
		 * @param {} id
		 * @return {}
		 */
        this.getOverlaysById = function(id) {
            return overlays.hasOwnProperty(id) ? overlays[id] : false;
        };
		/**
		 * 鑾峰彇鎵€鏈夋爣娉�
		 * @return {}
		 */
        this.getAllOverlays = function(type) {
            if (type == 'Array') {
                var all = [];
                for (var p in overlays) {
                    if (overlays.hasOwnProperty(p) && overlays[p] != undefined) {
                        all.push(overlays[p]);
                    }
                }
                return all;
            } else {
                return overlays;
            }
        };
        this.setFitView = function(overlays) {
            var _overlays = overlays;
            if (_overlays == undefined) {
                _overlays = [];
                filter(overlays, function(o) {
                    _overlays.push(o);
                });
            }
            mapObj.setFitView(_overlays);
        };
        this.getMap = function() {
            return mapObj;
        };
		/**
		 * 缁樺埗椹捐溅瀵艰埅璺嚎
		 * @param {} start
		 * @param {} end
		 * @param {} steps
		 */
        this.drivingDrawLine = function(start, end, steps) {
            var length = steps.length;
            this.clearMap();
            var extraPath, extraLine, id;
            if (start != null) {
                var startMarker = this.getOverlaysById('jrad-marker-start');
                if (!startMarker) {
                    //璧风偣銆佺粓鐐瑰浘鏍�
                    var sicon = new h.Icon({
                        image: '/shangcheng/css/images/map/poi.png',
                        size: new h.Size(44, 44),
                        imageOffset: new h.Pixel(0, 0)
                    });
                    startMarker = new h.Marker({
                        id: 'jrad-marker-start',
                        map: mapObj,
                        icon: sicon,
                        //澶嶆潅鍥炬爣
                        visible: true,
                        position: start
                    });
                    overlays['jrad-marker-start'] = startMarker;
                } else {
                    startMarker.setPosition(start);
                }
                extraPath = [];
                extraPath.push(start);
                extraPath.push(steps[0].path[0]);
                id = 'jrad-polyline-' + $.uuid;
                extraLine = new h.Polyline({
                    id: id,
                    map: mapObj,
                    path: extraPath,
                    strokeColor: '#9400D3',
                    strokeOpacity: 0.7,
                    strokeWeight: 2,
                    strokeStyle: 'dashed',
                    strokeDasharray: [10, 5]
                });
                overlays[id] = extraLine;
            }
            if (end != null) {
                if (!endMarker) {
                    var endMarker = this.getOverlaysById('jrad-marker-end');
                    var eicon = new h.Icon({
                        image: '/shangcheng/css/images/map/poi.png',
                        size: new h.Size(44, 44),
                        imageOffset: new h.Pixel(0, -88)
                    });
                    endMarker = new h.Marker({
                        id: 'jrad-marker-end',
                        map: mapObj,
                        icon: eicon,
                        //澶嶆潅鍥炬爣
                        visible: true,
                        position: end
                    });
                    overlays['jrad-marker-end'] = endMarker;
                } else {
                    endMarker.setPosition(end);
                }
                extraPath = [];
                var path_xy = steps.slice(-1)[0].path;
                extraPath.push(end);
                extraPath.push(path_xy.slice(-1)[0]);
                id = 'jrad-polyline-' + $.uuid;
                extraLine = new h.Polyline({
                    id: id,
                    map: mapObj,
                    path: extraPath,
                    strokeColor: '#9400D3',
                    strokeOpacity: 0.7,
                    strokeWeight: 2,
                    strokeStyle: 'dashed',
                    strokeDasharray: [10, 5]
                });
                overlays[id] = extraLine;
            }
            var drawpath, polylineArr = [];
            var options = null;
            for (var s = 0; s < length; s++) {
                drawpath = steps[s].path;
                if (!$.isArray(drawpath) || drawpath.length == 0) {
                    continue;
                }
                options = steps[s].options;
                options = $.extend({
                    id: 'jrad-polyline-' + $.uuid,
                    map: mapObj,
                    path: drawpath,
                    strokeColor: '#9400D3',
                    strokeOpacity: 0.5,
                    strokeWeight: 2,
                    strokeDasharray: [10, 5]
                }, options);
                var p = new h.Polyline(options);
                overlays[options.id] = p;
                polylineArr.push(p);
            }
            if (polylineArr.length != 0) {
                this.setFitView(polylineArr);
            }
            return polylineArr;
        };
        var filter = function(overlay, callback) {
            try {
                if (overlay == null) {
                    for (var id in overlays) overlays.hasOwnProperty(id) && overlays[id] != undefined && filter(overlays[id], callback);
                } else if (typeof overlay == 'string') {
                    !!overlays[overlay] && filter(overlays[overlay], callback);
                } else if (overlay.constructor.toString().indexOf('Array') > -1) {
                    for (var i = 0; i < overlay.length; i++) {
                        !!overlay[i] && filter(overlay[i], callback);
                    }
                } else {
                    if ('object' == typeof overlay) {
                        if (overlay instanceof AMap.Marker || overlay instanceof AMap.Polyline || overlay instanceof AMap.Polygon || overlay instanceof AMap.Circle) {
                            overlay && callback(overlay);
                        } else {
                            for (var id in overlay) overlay.hasOwnProperty(id) && overlay[id] != undefined && filter(overlay[id], callback);
                        }
                    }
                }
            } catch (e) {
                return false;
            }
        };
        var hideOrShow = function(overlay, toggle) {
            overlay[toggle]();
        };
        this.toggle = function(overlay) {
            var self = this;
            filter(overlay, function(o) {
                var toggle = o.isHidden ? 'show' : 'hide';
                o.isHidden = !o.isHidden;
                try {
                    o.setMap(self.getMap());
                } catch (e) {
                }
                hideOrShow(o, toggle);
            });
        };
        this.show = function(overlay) {
            var self = this;
            filter(overlay, function(o) {
                try {
                    o.setMap(self.getMap());
                } catch (e) {
                }
                o.isHidden = false;
                if (o instanceof h.Marker && cluster && cluster instanceof h.MarkerClusterer) {
                    cluster.addMarker(o);
                }
                hideOrShow(o, 'show');
            });
        };
        this.hide = function(overlay) {
            filter(overlay, function(o) {
                o.isHidden = true;
                hideOrShow(o, 'hide');
                if (o instanceof h.Marker && cluster && cluster instanceof h.MarkerClusterer) {
                    cluster.removeMarker(o);
                }
            });
        };
        this.removeOverlays = function(overlay) {
            filter(overlay, function(o) {
                o.setMap(null);
                if (o instanceof h.Marker && cluster && cluster instanceof h.MarkerClusterer) {
                    cluster.removeMarker(o);
                }
                var id = o.get('id');
                delete overlays[id];
            });
        };
        // 璁＄畻澶氱偣鐨勪腑蹇冪偣
        var countCenter = function(arr) {
            if (this instanceof h.Polyline) {
                var length = arr.length;
                return arr[parseInt(length / 2)];
            }
            var min_lat = 0;
            var max_lat = 0;
            var min_lng = 0;
            var max_lng = 0;
            $.each(arr, function(index, val) {
                if (min_lat == 0) {
                    min_lat = val.lat;
                }
                if (max_lat == 0) {
                    max_lat = val.lat;
                }
                if (min_lng == 0) {
                    min_lng = val.lng;
                }
                if (max_lng == 0) {
                    max_lng = val.lng;
                }
                if (min_lat > val.lat) {
                    min_lat = val.lat;
                }
                if (max_lat < val.lat) {
                    max_lat = val.lat;
                }
                if (min_lng > val.lng) {
                    min_lng = val.lng;
                }
                if (max_lng < val.lng) {
                    max_lng = val.lng;
                }
            });
            var center_lng = (min_lng + max_lng) / 2;
            var center_lat = (min_lat + max_lat) / 2;
            return new h.LngLat(center_lng, center_lat);
        };
        // 鑾峰彇鏍囨敞鐗╃殑涓績鐐�
        this.getOverlayCenter = function(overlay) {
            if ($.isArray(overlay)) {
                return countCenter(overlay);
            } else if (typeof overlay == 'string') {
                overlay = this.getOverlaysById(overlay);
                if (overlay === false) {
                    return mapObj.getCenter();
                }
            } else if (typeof overlay == 'object') {
                var flag = false;
                if(overlay.CLASS_NAME == 'AMap.Polyline'){
                    flag = true;
                }else{
                    for (var i = 1; i < 6; i++) {
                        flag = flag || overlay instanceof h[this.overlayTypeCode[i]];
                    }
                }
                if (!flag) {
                    return mapObj.getCenter();
                }
            }
            if (overlay.getPosition) {
                return overlay.getPosition();
            } else if (overlay.getCenter) {
                return overlay.getCenter();
            } else if (overlay.getPath) {
                return countCenter.apply(overlay, [overlay.getPath()]);
            }
        };
		/**
		 * 娣诲姞鏂扮殑鍥惧厓
		 * @param {} id
		 * @param {} type
		 * @param {} arra
		 * @param {} content
		 */
        this.newArea = function(id, type, arra, content, func) {
            var overlay = null,
                center = null;
            if (overlays.hasOwnProperty(id)) {
                overlays[id].setMap(null);
                delete overlays[id];
            }
            switch (type.toLowerCase()) {
                case 'polygon':
                case 'rectangle':
                    var arr = new Array();
                    if (type == 'Rectangle' && arra.length == 2) {
                        var lnglat = arra[0].split(',');
                        var lnglat2 = arra[1].split(',');
                        arra.length = 0;
                        arra.push(lnglat.join(','));
                        arra.push(lnglat[0] + ',' + lnglat2[1]);
                        arra.push(lnglat2.join(','));
                        arra.push(lnglat2[0] + ',' + lnglat[1]);
                    }
                    for (var i = 0; i < arra.length; i++) {
                        var lnglat = arra[i].split(',');
                        arr.push(new h.LngLat(lnglat[0], lnglat[1]));
                    }
                    var opt = {
                        id: id,
                        map: mapObj,
                        path: arr,
                        strokeColor: '#046788',
                        strokeOpacity: 0.6,
                        strokeWeight: 3,
                        fillColor: '#046788',
                        fillOpacity: 0.2
                    };
                    overlay = new h.Polygon(opt);
                    //mapObj.addOverlays(overlay);
                    break;
                case 'circle':
                    var radius = parseFloat(arra[1]);
                    var opt = {
                        id: id,
                        map: mapObj,
                        center: new h.LngLat(arra[0].split(',')[0], arra[0].split(',')[1]),
                        radius: radius,
                        strokeColor: '#046788',
                        strokeOpacity: 0.6,
                        strokeWeight: 3,
                        fillColor: '#046788',
                        fillOpacity: 0.2
                    };
                    overlay = new h.Circle(opt);
                    break;
                case 'marker':
                    overlay = this.addMarker(arra[0], {
                        id: id
                    });
                    break;
                case 'polyline':
                    var arr = new Array();
                    for (var i = 0; i < arra.length; i++) {
                        var lnglat = arra[i].split(',');
                        arr.push(new h.LngLat(lnglat[0], lnglat[1]));
                    }
                    var opt = {
                        id: id,
                        map: mapObj,
                        path: arr,
                        strokeColor: '#046788',
                        strokeOpacity: 0.6,
                        strokeWeight: 3,
                        strokeStyle: 'solid'
                    };
                    overlay = new h.Polyline(opt);
                    break;
            }
            overlays[id] = overlay;
            if (content != undefined && overlay != undefined) {
                var _infoWindow = new h.InfoWindow({
                    isCustom: false,
                    closeWhenClickMap: true,
                    content: content
                });
                center = this.getOverlayCenter(overlay);
                listenerEvents[id] = AMap.event.addListener(overlay, 'click', function(e) {
                    if ($.isFunction(func)) {
                        var opt = {
                            id: id,
                            mapTool: self,
                            overlay: overlay,
                            infoWindow: _infoWindow,
                            center: center,
                            e: e
                        };
                        func.apply(this, [opt]);
                    } else {
                        _infoWindow.open(mapObj, e.lnglat);
                    }
                });
            }
            return overlay;
        };
        this.clearMove = function() {
            if (markerMovingControl) markerMovingControl.stop();
            markerMovingControl = null;
        };
        this.startMove = function(speed, callback) {
            var marker = this.getOverlaysById('jrad-marker-history');
            if (marker) {
                var markerArray = marker.markerArray;
                markerMovingControl instanceof h.MarkerMovingControl && markerMovingControl.destory();
                markerMovingControl = new h.MarkerMovingControl(mapObj, marker, markerArray, speed, callback);
            }
        };
        this.pauseMove = function() {
            if (markerMovingControl) {
                markerMovingControl.stop();
                return true;
            } else return false;
        };
        this.stopMove = function() {
            try {
                markerMovingControl.stop();
                markerMovingControl._marker.setPosition(markerMovingControl._path[0]);
                markerMovingControl._currentIndex = 0;
                return true;
            } catch (e) {
                return false;
            }
        };
        this.setMoveto = function(index) {
            if (markerMovingControl) {
                markerMovingControl._currentIndex = index;
                return true;
            } else return false;
        };
        this.start = function() {
            if (markerMovingControl) {
                if (markerMovingControl._currentIndex == 0) {
                    markerMovingControl.restart();
                } else {
                    markerMovingControl.move();
                }
                return true;
            } else return false;
        };
        this.setSpeed = function(speed) {
            if (markerMovingControl) {
                markerMovingControl.setSpeed(speed);
                return true;
            } else return false;
        };
        this.setCount = function(count) {
            if (markerMovingControl) {
                markerMovingControl.setCount(count);
                return true;
            } else return false;
        };
        // 鏌ヨ璺嚎
        this.searchDrivingPath = function() {
            AMap.getDrivingPath.apply(AMap, arguments);
        };
        this.destroy = function() {
            this.clearMap();
            !!mapObj && mapObj.destroy() && (mapObj = undefined);
        };
    };
    h.MarkerMovingControl = function(map, marker, path, speed, callback) {
        var self = this;
        this._map = map;
        this._marker = marker;
        this._path = path;
        this._currentIndex = 0;
        this._speed = speed || 100;
        this._count = 4;
        this._direction = 0;
        this._percent = 1 / (path.length - 1);
        this._callback = callback || null;
        this._marker.setMap(map);
        this._marker.setPosition(path[0]);
        this._listenToMoving = h.event.addListener(this._marker, 'moving', function() {
            var bounds = map.getBounds();
            var position = this.getPosition();
            if (!bounds.contains(position)) {
                map.panTo(position);
            } else {
                var pixel = map.lnglatTocontainer(position),
                    size = map.getSize(),
                    _width = size.width,
                    _height = size.height,
                    px = pixel.x,
                    py = pixel.y,
                    $details = $('.bottom-wrap');
                if ($details.hasClass('show-wrap')) {
                    _height -= $details.outerHeight();
                }
                if (px < 100 || (_width - px < 150) || py < 100 || (_height - py < 150)) {
                    map.panTo(position);
                }
            }
        });
    };
	/**
	 * 绉诲姩marker锛屼細浠庡綋鍓嶄綅缃紑濮嬪悜鍓嶇Щ鍔�
	 */
    h.MarkerMovingControl.prototype.move = function() {
        if (!this._listenToStepend) {
            this._listenToStepend = h.event.addListener(this, 'stepend', function() {
                this.step();
            }, this);
        }
        this.step();
    };
	/**
	 * 鍋滄绉诲姩marker锛岀敱浜庢帶浠朵細璁板綍褰撳墠浣嶇疆锛屾墍浠ョ浉褰撲簬鏆傚仠
	 */
    h.MarkerMovingControl.prototype.stop = function() {
        $('.jrad-btn-start .icon-font-play').removeClass().addClass('icon-font-play');
        this._marker.stopMove();
    };
	/**
	 * 閲嶆柊寮€濮嬶紝浼氭妸marker绉诲姩鍒拌矾寰勭殑璧风偣鐒跺悗寮€濮嬬Щ鍔�
	 */
    h.MarkerMovingControl.prototype.restart = function() {
        this.stop();
        this._marker.setPosition(this._path[0]);
        this._currentIndex = 0;
        this.move();
    };
	/**
	 * 鍚戝墠绉诲姩涓€姝�
	 */
    h.MarkerMovingControl.prototype.step = function() {
        if (this._direction == 0) {
            var nextIndex = this._currentIndex + 1;
            if (nextIndex < this._path.length) {
                if (!this._listenToMoveend) {
                    this._listenToMoveend = h.event.addListener(this._marker, 'moveend', function() {
                        this._currentIndex++;
                        h.event.trigger(this, 'stepend');
                    }, this);
                }
                if (this._callback && typeof this._callback == 'function') {
                    var percent = (this._currentIndex * this._percent) * 100;
                    this._callback(percent, nextIndex);
                }
                var _speed = this._speed ? this._speed : 1000;
                _speed < 1 && (_speed = 1);
                if (this._path[this._currentIndex].lat == this._path[nextIndex].lat && this._path[this._currentIndex].lng == this._path[nextIndex].lng) {
                    this._currentIndex++;
                    h.event.trigger(this, 'stepend');
                    return;
                }
                this._marker.moveTo(this._path[nextIndex], _speed * this._count);
            } else {
                if (nextIndex = this._path.length) {
                    if (this._callback && typeof this._callback == 'function') {
                        this._callback(100, 0);
                    }
                }
                this.stop();
                this._currentIndex = 0;

            }
        }
    };
	/**
	 * 璁剧疆marker绉诲姩閫熷害
	 */
    h.MarkerMovingControl.prototype.setSpeed = function(speed) {
        this._speed = speed;
    };
    h.MarkerMovingControl.prototype.setCount = function(count) {
        this._count = count;
        this._marker.stopMove();
        this.step();
    };
    h.MarkerMovingControl.prototype.destory = function() {
        this._listenToStepend && (h.event.removeListener(this._listenToStepend), delete this._listenToStepend);
        this._listenToMoving && (h.event.removeListener(this._listenToMoving), delete this._listenToMoving);
        this._marker.stopMove();
    };
	/**
	 * @title 璋冪敤楂樺痉鏈嶅姟鏍规嵁澶氱偣姹傞亾璺泦鍚�
	 * @method h.getDrivingPath
	 * @param {Array} a 鐐癸紙AMap.LngLat锛夐泦鍚�
	 * @param {Function} d 鎴愬姛鍥炶皟鍑芥暟
	 * @param {Function} r 澶辫触鍥炶皟鍑芥暟
	 * @param {Number} s 瑙勫垝璺姴绛栫暐
	 */
    h.getDrivingPath = function(a, d, r, s) {
        var b = a.length,
            s = s || 0,
            c = a[0],
            f = a.slice(-1)[0],
            e = [];
        if (c != undefined && c instanceof h.LngLat && f != undefined && f instanceof h.LngLat) {
            c = ['origin=' + c.toString(), 'destination=' + f.toString(), 'strategy=' + s];
            var opts = {
                extensions: 'base',
                key: h.Conf.key,
                output: 'json'
            };
            for (g in opts) opts.hasOwnProperty(g) && c.push(g + '=' + opts[g]);
            for (g = 1; g < b - 1 && 16 > g; g += 1) e.push(a[g].toString());
            e.length && c.push('waypoints=' + e.join(';'));
            b = 'http://restapi.amap.com/v3/direction/driving' + (0 < c.length ? '?' + c.join('&') : '');
            b = new h.Http.JSONP(b, {
                callback: 'callback'
            });
            h.event.addListener(b, 'complete', function(a) {
                var path = [];
                if (a.count) {
                    for (var f = 0; f < a.route.paths.length; f++)
                        for (var e = a.route.paths[f].steps, g = 0; g < e.length; g++) {
                            var l = e[g].polyline.split(';'),
                                k;
                            for (k in l)
                                if (l.hasOwnProperty(k)) {
                                    var m = l[k].split(',');
                                    m = new h.LngLat(m[0], m[1]);
                                    path.push(m);
                                }
                            if ((g + 1) < e.length) {
                                l = e[g + 1].polyline.split(';');
                                if (l.hasOwnProperty(0)) {
                                    var m = l[0].split(',');
                                    m = new h.LngLat(m[0], m[1]);
                                    path.push(m);
                                }
                            }
                        }
                }
                typeof d == 'function' && d.apply(h, [a.route, path]);
            }, this);
            typeof r == 'function' && h.event.addListener(b, 'error', r, this);
        }
    };
	/**
	 * 澶氳竟褰㈠寘鍚偣
	 * @param {} p 鍒ゆ柇鐨勭偣
	 * @return {Boolean} true 鍖呭惈锛宖alse涓嶅寘鍚�
	 */
    h.Polygon.prototype.Contains = function(p) {
        if (this.hasOwnProperty('contains') && 'function' == typeof this['contains']) {
            return this.contains(p);
        } else {
            var nCross = 0; // 璁板綍浜ょ偣涓暟
            var path = this.getPath();
            var nCount = path.length;
            for (var i = 0; i < nCount; i++) {
                var p1 = path[i];
                var p2 = path[(i + 1) % nCount];
                // 姹傝В y=p.lat 涓� p1p2 鐨勪氦鐐�
                // p1p2 涓� y=p0.y骞宠
                if (p1.lat == p2.lat) continue;
                // 浜ょ偣鍦╬1p2寤堕暱绾夸笂
                if (p.lat < Math.min(p1.lat, p2.lat)) continue;
                // 浜ょ偣鍦╬1p2寤堕暱绾夸笂
                if (p.lat >= Math.max(p1.lat, p2.lat)) continue;
                // 姹備氦鐐圭殑 X 鍧愭爣
                var x = parseFloat(p.lat - p1.lat) * parseFloat(p2.lng - p1.lng) / parseFloat(p2.lat - p1.lat) + p1.lng;
                if (x > p.lng) nCross++; // 鍙粺璁″崟杈逛氦鐐�
            }
            // 鍗曡竟浜ょ偣涓哄伓鏁帮紝鐐瑰湪澶氳竟褰箣澶�
            return (nCross % 2 == 1);
        }
    };
	/**
	 * 鍦嗗寘鍚偣
	 * @param {} p 鍒ゆ柇鐨勭偣
	 * @return {Boolean} true 鍖呭惈锛宖alse涓嶅寘鍚�
	 */
    h.Circle.prototype.Contains = function(p) {
        if (this.hasOwnProperty('contains') && 'function' == typeof this['contains']) {
            return this.contains(p);
        } else {
            var c = this.getCenter();
            var radius = this.getRadius();
            var distance = p.distance(c);
            // 鍒板渾蹇冪殑璺濈灏忎簬绛変簬鍗婂緞 鍦ㄥ渾鍐�
            return distance <= radius;
        }
    };
	/**
	 * 绾垮寘鍚偣
	 * @param {} p 鍒ゆ柇鐨勭偣
	 * @return {Boolean} true 鍖呭惈锛宖alse涓嶅寘鍚�
	 */
    h.Polyline.prototype.Contains = function(p) {
        var path = this.getPath();
        var length = path.length;
        for (var i = 0; i < length - 1; i++) {
            var p1 = path[i],
                p2 = path[(i + 1) % length];
            if (p2.lng == p1.lng) {
                if (p.lng != p1.lng) continue;
                else if (p.lat < p.lat < Math.max(p1.lat, p2.lat) && p.lat > p.lat < Math.min(p1.lat, p2.lat)) {
                    return true;
                } else {
                    continue;
                }
            } else {
                var k = (p2.lat - p1.lat) / (p2.lng - p1.lng),
                    // 鏂滅巼
                    b = p2.lat - k * p2.lng;
                if ((p.lat - k * p.lng) == b) return true;
            }
        }
        return false;
    };
    h.Circle.prototype.getArea = function() {
        return Math.PI * Math.pow(this.getRadius(), 2);
    };
})(AMap);