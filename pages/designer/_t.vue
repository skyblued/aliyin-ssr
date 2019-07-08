<template>

	<div class="design">
 	 <no-ssr>

		<header class="header">
			<desHeader 
			:faceImg="CurrentTemplateDataComputed && CurrentTemplateDataComputed.list[0] && CurrentTemplateDataComputed.list[0].Thumb"
			:headerParams="headerParams" 
			@clearClone="clearClone"
			@setPreview="setPreview" 
			:setundo="setundo" 
			:isSave="isSave"
			:previewbtn="preview"
			@setDownAndPrint="setDownAndPrint" 
			@clear="clearCanvas"
			@handleSave="clickAllSavePage" 
			@againFile="againFile"
			 ></desHeader>
			<div class="design_title_input"><input class="works" type="text" maxlength="20" v-model="design_title" @change="setTemplateTitle" placeholder="设置作品名称"></div>
		</header>
		<div class="design-main" v-if="!$store.state.login.loginShow">
			<div class="side">
				<!-- 侧边工具导航栏 --> 
				<div class="tools myfont">
					<ul class="tools-list" ref="toolList">
						<li :class="sideTitle == 'temp' ? 'li-active': ''" @click="sideToggle('temp')">
							<span class="tools-icon"></span>
							<p>模板</p>
						</li>
						<li :class="sideTitle == 'fonttext' ? 'li-active': ''" @click="sideToggle('fonttext')">
							<span class="tools-icon"></span>
							<p>文字</p>
						</li>
						<li :class="sideTitle == 'matter' ? 'li-active': ''" @click="sideToggle('matter')">
							<span class="tools-icon"></span>
							<p>素材</p>
						</li>
						<li :class="sideTitle == 'background' ? 'li-active': ''" @click="sideToggle('background')">
							<span class="tools-icon"></span>
							<p>背景</p>
						</li>
						<li :class="sideTitle == 'plugin' ? 'li-active': ''" @click="sideToggle('plugin')">
							<span class="tools-icon"></span>
							<p>二维码</p>
						</li>
						<li :class="sideTitle == 'uploading' ? 'li-active': ''" @click="sideToggle('uploading')">
							<span class="tools-icon"></span>
							<p>上传</p>
						</li>
						<!-- -->
						<li  v-if="superAdmin" :class="sideTitle == 'admin' ? 'li-active': ''" @click="sideToggle('admin')">
							<span class="tools-icon"></span>
							<p>审核</p>
						</li>
						<li  v-if="identity == 'TemplatePages'" 
							
							:class="sideTitle == 'psd' ? 'li-active': ''" 
							@click="sideToggle('psd')"
						>
							<span class="tools-icon"></span>
							<p>设计师</p>
						</li>
					</ul>
				</div>
			</div>
			<!-- 工具详情面板 -->
			<div class="tool-container">
				<div :class="{'toolface': true, 'active-toggle': !toggle}" ref="toolface">
					
				  <transition name="left-show" mode="out-in">
					<div class="left-slide-show" key="1" v-if="sideTitle == 'temp'">
						<temp @templatePageReplace="templatePageReplace" :templateInfo="templateInfo"></temp>
					</div>

					<div class="left-slide-show" key="2" v-if="sideTitle == 'matter'">
						<Matter 
						@getDragAndDropBox="getDragAndDropBox"
						:copyBox="copyBox.display" @handleAdd="handleAdd" @setCopyBox="setCopyBox" :mouseTop="mouseTop"></Matter>
					</div>

					<div class="left-slide-show" key="3" v-if="sideTitle == 'fonttext'">
						<FontText 
							@getDragAndDropBox="getDragAndDropBox"
						@addFontText="addFontText"></FontText>
					</div>

					<div class="left-slide-show" key="4" v-if="sideTitle == 'background'">
						<background 
							@handleChangeBackground="handleChangeBackground"
							@setShowPickColor="showPickColor = {show: true, type: 'background'}"
							:useColor="useColor"
							:fontColorSelect="fontColorSelect"
						></background>
					</div>

					<div class="left-slide-show" key="5" v-if="sideTitle == 'plugin'">
						<Plugin @handleAddQrCode="handleAdd"></Plugin>
					</div>

					<div class="left-slide-show" key="6" v-if="sideTitle == 'uploading'">
						<Uploading :copyBox="copyBox.display" @handleAdd="handleAdd" @setCopyBox="setCopyBox"></Uploading>
					</div>
					
					<div class="left-slide-show" key="7" v-if="sideTitle == 'admin' && templateInfo">
						<SuperAdmin 
							:templateInfo="templateInfo"
							:PageData="getPageData"
							@superBtn="superBtn"
							@dingchang="dingchang"
							@dingchang2="dingchang2"
						></SuperAdmin>
					</div>
					<div class="left-slide-show" key="8" v-if="sideTitle == 'psd'">
						<Psd
							:templateInfo="templateInfo"
							:zoom="zoom"
							@uploadpsd="uploadpsd"
							@setMasking="addMasking"
						></Psd>
					</div>
				  </transition>
				</div>
				
				<!-- 切换按钮 -->
				<div :class="{'toggle': true, 'active-toggle-btn': !toggle  }" @click="handleToggle">
					<i :class="{'el-icon-arrow-right': !toggle, 'el-icon-arrow-left': toggle}"></i>
				</div>
			</div>


			<div class="designer" :style="{'padding-left': toggle? '' :'60px'}">
				<div class="editor-container">
					<!-- 画布 -->
					<div id="editor-page" v-loading="saveSuccess" element-loading-text="保存中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" ref="editorPage" class="editor-page">
					<!-- 顶部工具栏 -->
						<div class="top-tool" :style="{'transform': toolShow.father ? '' : 'translateY(-100%)'}">
							<transition name="fade">
								<!-- 文字 -->
								<div :key="toolType" class="text-tool" v-if="toolType == 'text'">
									<!-- 颜色 -->
										<div class="text-item text-color">
											<div class="item-content">
												<span @click="setToolBox('text_color')" class="item-content-color" :style="{background: fontColorSelect}"></span>
											</div>
											<div class="item-active" v-show="tool_box == 'text_color'">
												<span class="board"></span>
												<Setcolor 
													@setShowPickColor="showPickColor = {show: true, type: 'text'}"
													@setTextColor="fontColor" 
													:selectColor="fontColorSelect" 
													:useColor="useColor"
												></Setcolor>
											</div>
										</div>

										<div class="line"></div>
									<!-- 字体设置 -->
										<div class="text-item text-font">
											<div class="text-img" @click="setToolBox('text_family')" ref="textDefault">
												<img :src="$store.state.port.imgBaseUrl + textDefault">
											</div>
											<!-- <div class="change-family">
												<span class="number-down resize-btn" ></span>
												<span class="number-up resize-btn" ></span>
											</div> -->
											<div class="item-active" v-if="tool_box == 'text_family'">
												<span class="board"></span>
												<div class="family-list">
													<div class="family-type">
														<span @click="setFamilyType('all')" :class="{'type-active': familyType == 'all'? true : false}">全部</span>
														<span @click="setFamilyType('free')" :class="{'type-active': familyType == 'free'? true : false}">免费</span>
														<span @click="setFamilyType('use')" :class="{'type-active': familyType == 'use'? true : false}">商用</span>
													</div>
													<div class="family-item" v-for="(item,index) in familyList" :key="index">
														<div @click="handleCommand(item, index)" class="family-value">
															<img :src="$store.state.port.imgBaseUrl + item.FontThumb" alt="">
														</div>
													</div>
												</div>
											</div>
										</div>

										<div class="line"></div>
									<!-- 字体大小 -->
										<div class="text-item text-size" @click="setText('size')">
											<div class="text-num">
												<div @click="setToolBox('text_size')">{{textObj.size|setInt}}</div>
											</div>
											<div class="change-family">
												<span class="number-up resize-btn" @click="handleSize('up')"></span>
												<span class="number-down resize-btn" @click="handleSize('down')"></span>
											</div>
											<div class="item-active" v-if="tool_box == 'text_size'">
												<span class="board"></span>
												<div class="size-list" ref="sizeList">
													<div class="size-item" v-for="i in setSizeScoped" :key="i" @mouseenter="handleSize(i)" @click="handleSize('')">{{i}}</div>
												</div>
											</div>
										</div>

										<div class="line"></div>
									<!-- 样式 -->
										<div class="text-item text-style">
											
											<div :class="{'text-style-item': true, 'italic': true, active: textObj.itailic == 1? true : false}" @click="handleTextStyle('itailic')"></div>
									
										
											<div :class="{'text-style-item': true, 'underline': true, active: textObj.underline == 1? true : false}" @click="handleTextStyle('underline')"></div>
										
										
											<div class="text-item-bold">
												<div :class="{'text-style-item': true, 'bold': true, active: textObj.bold != 0 ? true : false}" @click="setToolBox('tool_bold')"></div>
												<div class="text-item-bold-content" v-if="tool_box == 'tool_bold'">
													<span>加粗 </span>
													<span class="san"></span>
													<el-slider v-model="textObj.bold" @change="handleTextBold" :show-tooltip='false' :max="100"></el-slider>
													<span>{{textObj.bold.toFixed(0)}}</span>
												</div>
											</div>
										
										</div>

										<div class="line"></div>
									<!-- 对齐方式 -->
										<div class="text-item align-check">
											<div class="align-check-choose"  @click="setToolBox('text_choose')">
											</div>
											<div class="item-active choose-active" v-if="tool_box == 'text_choose'">
												<span class="board"></span>
												<div class="choose-item" @click="handleTextAlign('left')">
													<span class="align-left"></span>
												</div>
												<div class="choose-item" @click="handleTextAlign('center')">
													<span class="align-center"></span>
												</div>
												<div class="choose-item" @click="handleTextAlign('right')">
													<span class="align-right"></span>
												</div>
												<div v-if="false" class="choose-item" @click="handleTextAlign('fenbu')">
													<span class="align-fenbu"></span>
												</div>
											</div>
											<!-- 间距 -->
											<el-tooltip effect="light" content="间距" placement="top">
												<div class="check-spacing" @click="setToolBox('text_spacing')"></div>
											</el-tooltip>
 
											<div class="item-active text-spacing" v-if="tool_box == 'text_spacing'">
												<span class="board"></span>
												<div class="spacing-list">
													<div class="spacing-item">
														<span>字间距 : </span>
														<el-slider v-model="fontStyle.spacing" :show-tooltip='false' :format-tooltip="handleSpacing" :min="-400" :max="1600"></el-slider>
														<span>{{fontStyle.spacing|setInt}}</span>
													</div>
													<div class="spacing-item">
														<span>行间距 : </span>
														<el-slider v-model="fontStyle.line" :show-tooltip='false' :format-tooltip="handleLine" :min="-400" :max="1600"></el-slider>
														<span>{{fontStyle.line|setInt}}</span>
													</div>
												</div>
											</div>
										</div>

										<div class="line"></div>
									<!-- 扩展功能  v-if="false"-->
										<div class="text-item">
											<div class="text-conversion" data-tip="大小写转换"
											 	v-if="codeTypeTool == 'text'"
												@click="textConversion"
											>Aa</div>
											<!-- <div @click="textToAdsorb">path</div> -->
											<!--  <div>弧形</div> -->
										</div>
								</div>
								
								<!-- 图片 -->
								<div :key="toolType" class="image-tool" v-if="toolType == 'image' || toolType == 'svg' || toolType == 'adsorb'">
										<div class="image-item image-size" data-tip="尺寸">
											<span class="image-icon" @click="setToolBox('image_size')"></span>
											<div class="image-active" v-if="tool_box == 'image_size' && codeBox">
												<span class="board"></span>
												<div class="size-item">
													<span>宽度 : </span>
													<input type="number" :placeholder="codeBox ? Math.floor(codeBox.width) : 0" v-model="imageObj.width">
												</div>
												<div class="size-item">
													<span>高度 : </span>
													<input type="number" :placeholder="codeBox ? Math.floor(codeBox.height) : 0" v-model="imageObj.height">
												</div>
												<div class="size-item">
													<span @click="setElemSize">确定</span><span>取消</span>
												</div>
											</div>
										</div>

										<!-- svg 颜色及尺寸 -->
										<template v-if="toolType == 'svg'">
											<div class="svg-tool">
												<div class="svg-fill-list" v-for="(item,index) in svgFillList.slice(0, 10)" 
                                                    :style="{background: item}" :key="index" 
                                                    @click="setToolBox('svg_tool'+index, item)"
                                                ></div>
												<div class="svg-fill-active" v-show="tool_box == svgToolPosition.show" :style="{left: svgToolPosition.left}">
													<span class="board"></span>
													<Setcolor 
														@setShowPickColor="showPickColor = {show: true, type: 'svg'}"
														@setTextColor="handleSvgFill" 
														:selectColor="fontColorSelect" 
														:useColor="useColor"
													></Setcolor>
													<!-- <div>主题色</div>
													<div class="fill-zhuti">
														<el-color-picker @active-change="handleSvgFill"></el-color-picker>
													</div>
													<div>预设颜色</div>
													<div class="fill-default">
														<div class="fill-default-item" @click="handleSvgFill(item)" v-for="(item, index) in colorBackground" :style="{background: item}" :key="index"></div>
													</div> -->
												</div>
											</div>
										</template>

										<template v-if="toolType == 'image' || toolType == 'adsorb'">
											<div class="image-item image-clip" data-tip="裁剪" @click="imgClip">
												<span class="image-icon"></span>
											</div>
											<div v-show="toolType == 'image'" class="image-item image-background"  @click="setImageBackground" data-tip="设为背景">
												<span class="image-icon"></span>
											</div>
											<div v-show="toolType == 'image'" class="image-item image-reset" @click="changeImage" data-tip="换图">
												<span class="image-icon"></span>
											</div>
										</template>
										
								</div>
								<!-- 组合 -->
								<div :key="toolType" class="group-tool" v-if="toolType == 'group'">
									<div class="group-text">
										<div class="group-text-content">
											<span @click="setToolBox('group_color')" class="group-text-content-color" :style="{background: fontColorSelect}"></span>
										</div>
										<div class="group-text-active" v-if="tool_box == 'group_color'">
											<span class="board"></span>
											<Setcolor 
												@setShowPickColor="showPickColor = {show: true, type: 'group'}"
												@setTextColor="groupText" 
												:selectColor="fontColorSelect" 
												:useColor="useColor"
											></Setcolor>
										</div>
									</div>


									<div v-if="!group.isgroup" class="group-item" data-tip="组合" @click="setToolBox('')">
										<span class="group-icon group-box" @click="addGroup"></span>
									</div>
									<!-- 取消组合 -->
									<div v-else class="group-item" data-tip="取消组合" @click="setToolBox('')">
										<span class="group-icon group-box" @click="removeGroup"></span>
									</div>
									<div v-if="!group.isgroup" class="group-item" data-tip="对齐方式">
										<span class="group-icon group-align" @click="setToolBox('group-align')"></span>
										<div class="group-align-active" v-show="tool_box == 'group-align'">
											<span class="board"></span>
											<div @click="setGroupAlign('left')" class="group-align-item">
												<span class="g-align"></span>左边对齐
											</div>
											<div @click="setGroupAlign('center')" class="group-align-item">
												<span class="g-align x-middle"></span>水平居中
											</div>
											<div @click="setGroupAlign('right')" class="group-align-item">
												<span class="g-align right"></span>右边对齐
											</div>
											<div @click="setGroupAlign('middle')" class="group-align-item">
												<span class="g-align y-middle"></span>垂直居中
											</div>
											<div @click="setGroupAlign('top')" class="group-align-item">
												<span class="g-align top"></span>顶部对齐
											</div>
											<div @click="setGroupAlign('bottom')" class="group-align-item">
												<span class="g-align bottom"></span>底部对齐
											</div>
										</div>
									</div>
									<div v-if="!group.isgroup && group.set && group.set.members.length > 2" class="group-item" data-tip="分布" v-show="groupLength">
										<span class="group-icon group-fenbu" @click="setToolBox('group-fenbu')"></span>
										<div class="group-align-active" v-show="tool_box == 'group-fenbu'">
											<span class="board"></span>
											<div class="group-align-item" @click="fenbuGroup('droopLine')">
												<span class="y-fenbu"></span>水平分布
											</div>
											<div class="group-align-item" @click="fenbuGroup('flatLine')">
												<span class="x-fenbu"></span>垂直分布
											</div>
										</div>
									</div>
								</div>
								<!-- 背景图片-->
								<div :key="toolType" class="background-tool" v-if="toolType == 'background'">
									<div class="background-item" @click="handleActiveBackground" v-if="!backgroundShow">
										<span class="span-btn">背景编辑</span>
									</div>
									<div class="background-item" @click="clearRectSelect" v-else>
										<span class="span-btn">√</span>
									</div>
								</div>
								<!-- 参考线 -->
								<div style="height: 100%;line-height:39px;" key="refline" v-if="toolType == 'tool_refline'">
									<span v-if="false" style="width: 100px;padding: 5px 10px;cursor: pointer;border: 1px solid #999;border-radius: 5px;">颜色</span>
									<span @click="handleDelete" style="width: 100px;padding: 5px 10px;cursor: pointer;border: 1px solid #999;border-radius: 5px;">删除</span>
									
									<!-- <div class="text-item text-color">
										<div class="item-content">
											<span @click="setToolBox('add-ref')" class="item-content-color" :style="{background: fontColorSelect}"></span>
										</div>
										<div class="item-active" v-show="tool_box == 'add-ref'">
											<span class="board"></span>
											<Setcolor 
												@setShowPickColor="showPickColor = {show: true, type: 'text'}"
												@setTextColor="fontColor" 
											></Setcolor>
										</div>
									</div> -->
								</div>
							</transition>
						</div>
					<!-- 右侧公共工具竖栏  v-if="toolType !== 'background'"-->
						<div class="operate"  :style="{'transform': toolShow.father && toolType != 'tool_refline' ? '' : 'translateX(100%)'}">
							<div class="right-tool" @click="cloneEnd" v-show="this.toolType != 'background'">
								<div class="tool-title tool-copy">
									<span></span>
									<span>复制</span>
								</div>
							</div>
							<div class="right-tool"  v-show="this.toolType != 'background' && toolType != 'group'">
								<div class="tool-title tool-sort" @click="setToolBox('tool_move')">
									<span></span>
									<span>顺序</span>
								</div>
								<div class="right-tool-active make-move" v-show="tool_box == 'tool_move' && toolType != 'group'">
									<span class="right-tool-board"></span>
									<div 
										:class="`move-icon move-top ${getElemIndex.up ? '' : 'cant-use'}`" 
										@click="getElemIndex.up && makeMove(0)"
									>
										<span></span>上移一层
									</div>
									<div 
										:class="`move-icon move-bottom ${getElemIndex.down ? '' : 'cant-use'}`" 
										@click="getElemIndex.down && makeMove(1)"
									>
										<span></span>下移一层
									</div>
									<div 
										:class="`move-icon move-best-top ${getElemIndex.up ? '' : 'cant-use'}`"
									 	@click="getElemIndex.up && makeMove(2)">
										<span></span>移到最顶层
									</div>
									<div 
										:class="`move-icon move-best-bottom ${getElemIndex.down ? '' : 'cant-use'}`" 
										@click="getElemIndex.down && makeMove(3)"
									>
										<span></span>移到最底层
									</div>
								</div>
							</div>
							<div class="right-tool">
								<div class="tool-title tool-opacity" @click="setToolBox('tool_opacity')" >
									<span></span>
									<span>透明</span>
								</div>
								<div class="right-tool-active make-opacity" v-if="tool_box == 'tool_opacity'">
									<span>透明度 : </span>
									<span class="right-tool-board"></span>
									<el-slider v-model="opacityValue" :format-tooltip="formatTooltip" :show-tooltip='false' :max="100"></el-slider>
									<span>{{opacityValue}}</span>
								</div>
							</div>
							<div class="right-tool" v-show="false">
								<div class="tool-title tool-projection" @click="setToolBox('tool_projection')">
									<span class=""></span>
									<span>投影</span>
								</div>
								<div class="right-tool-active tool_projection" v-show="tool_box == 'tool_projection'">
									<span class="right-tool-board"></span>
									<Projection></Projection>
									<div class="projection-control">
										<div class="projection-control-item">
											<span>扩展 : </span>
											<el-slider :format-tooltip="projectionK" v-model="projectionList.k" :show-tooltip='false' :max="100"></el-slider>
											<span>{{projectionList.k}}</span>
										</div>
										<div class="projection-control-item">
											<span>距离 : </span>
											<el-slider :format-tooltip="projectionJ" v-model="projectionList.j" :show-tooltip='false' :max="100"></el-slider>
											<span>{{projectionList.j}}</span>
										</div>
										<div class="projection-control-item">
											<span>透明度 : </span>
											<el-slider :format-tooltip="projectionT" v-model="projectionList.t" :show-tooltip='false' :max="100"></el-slider>
											<span>{{projectionList.t}}</span>
										</div>
										<div class="projection-control-item">
											<span>角度 : </span>
											<el-slider :format-tooltip="projectionD" v-model="projectionList.d" :show-tooltip='false' :max="100"></el-slider>
											<span>{{projectionList.d}}</span>
										</div>
									</div>
									<div class="projection-control-off">
										<span>是否显示投影</span>
										<el-switch @change="setProjection" v-model="projectionList.off" active-color="rgba(0, 131, 233, 1)" inactive-color="#999"></el-switch>
									</div>
									
								</div>
							</div>
							<div class="right-tool" v-show="toolType != 'group'">
								<div class="tool-title tool-reverse" @click="setToolBox('tool_reverse')">
									<span class=""></span>
									<span>翻转</span>
								</div>
								<div class="right-tool-active tool_reverse" v-if="tool_box == 'tool_reverse'">
									<span class="right-tool-board"></span>
									<div class="reverse-x" @click="flip(-1,1)">
										<span></span>水平翻转
									</div>
									<div class="reverse-y" @click="flip(1,-1)">
										<span></span>垂直翻转
									</div>
								</div>
							</div>
							<div class="right-tool" v-if="false">
								<div class="tool-title tool-collect" :class="{'tool-active': false}">
									<span></span>
									<span>收藏</span>
								</div>
							</div>
							<div class="right-tool" >
								<div class="tool-title tool-lock" :class="{'tool-active': this.svgLock}" @click="lock">
									<span></span>
									<span>锁定</span>
								</div>
							</div>
							<div class="right-tool">
								<div class="tool-title tool-del " @click="del">
									<span class=""></span>
									<span>删除</span>
								</div>
							</div>
						</div>
					<!-- 加载动画 -->
						<div v-loading="templateAnimation" style="height: 100%" element-loading-text="加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, .8)"></div>
					<!-- 中心svg内容  templateAnimation
                    
                    -->
						<div id="editor-svg" ref="editorSvg" class="editor-svg"  
                            @click="tool_box = ''" 
                            @mousedown="editorPageDown($event)" 
                            @mousewheel="svgWheel($event)"
                        >
							<div 
								@mouseenter="enterDraw"
								@mouseleave="outDraw"
							class="canvas" ref="drawing" id="drawing" >
								<!-- 吸附参考线 && !group.set-->
								<div class="move-guide" v-if="guide.off && resizeBox.move  && guide.selectBox && !isClipAdsorb">
									<div class="guide-item guide-left" v-if="setGuide.off.l"></div>
									<div class="guide-item guide-top" v-if="setGuide.off.t"></div>
									<div class="guide-item guide-right" v-if="setGuide.off.r"></div>
									<div class="guide-item guide-bottom" v-if="setGuide.off.b"></div>
									<div class="guide-item guide-cx" v-if="setGuide.off.cx"></div>
									<div class="guide-item guide-cy" v-if="setGuide.off.cy"></div>
									<div class="elem" v-if="setGuide.off.left" :style="{left: setGuide.x1 + 'px', height: '100%'}"></div>
									<div class="elem" v-if="setGuide.off.top" :style="{top: setGuide.y1 + 'px', width: '100%'}"></div>
									<div class="elem" v-if="setGuide.off.right" :style="{left: setGuide.x2 + 'px', height: '100%'}"></div>
									<div class="elem" v-if="setGuide.off.bottom" :style="{top: setGuide.y2 + 'px', width: '100%'}"></div>
									<div class="elem" v-if="setGuide.off._cx" :style="{left: setGuide.cx + 'px', height: '100%'}"></div>
									<div class="elem" v-if="setGuide.off._cy" :style="{top: setGuide.cy + 'px', width: '100%'}"></div>
								</div>
								<!-- 出血线 -->
								<div class="out-blood-line" v-if="bleedLine.top">
									<div class="bleed-border bleed-top" 
										:style="`height: ${bleedLine.top}%;`"
									></div>
									<div class="bleed-border bleed-right" 
										:style="`top: ${bleedLine.top}%;width: ${bleedLine.right}%;height: ${100 - (bleedLine.top + bleedLine.bottom)}%`"
									></div>
									<div class="bleed-border bleed-bottom"
										:style="`height: ${bleedLine.bottom}%`"
									></div>
									<div class="bleed-border bleed-left"
										:style="`top: ${bleedLine.top}%;width: ${bleedLine.left}%;height: ${100 - (bleedLine.top + bleedLine.bottom)}%`"
									></div>
									<div class="bleed-top-line bleed-line"
										:style="`left: ${bleedLine.left}%;top: ${bleedLine.top}%; width: ${100 - (bleedLine.left + bleedLine.right)}%`"
									></div>
									<div class="bleed-line"
										:style="`left: ${bleedLine.left}%;bottom: ${bleedLine.bottom}%; width: ${100 - (bleedLine.left + bleedLine.right)}%`"
									></div>
									<div class="bleed_ruler_top_left bleed_ruler"
										:style="`top: ${bleedLine.top}%`"
									></div>
									<div class="bleed_ruler_top_right bleed_ruler"
										:style="`top: ${bleedLine.top}%`"
									></div>
									<div class="bleed_ruler_left_top bleed_ruler"
										:style="`left: ${bleedLine.left}%`"
									></div>
									<div class="bleed_ruler_left_bottom bleed_ruler"
										:style="`left: ${bleedLine.left}%`"
									></div>
									<div class="bleed_ruler_right_top bleed_ruler"
										:style="`right: ${bleedLine.right}%`"
									></div>
									<div class="bleed_ruler_right_bottom bleed_ruler"
										:style="`right: ${bleedLine.right}%`"
									></div>
									<div class="bleed_ruler_bottom_left bleed_ruler"
										:style="`bottom: ${bleedLine.bottom}%`"
									></div>
									<div class="bleed_ruler_bottom_right bleed_ruler"
										:style="`bottom: ${bleedLine.bottom}%`"
									></div>
								</div>
							</div>
							<!-- 参考线 -->
							<div class="ref-line">
								<div 
									v-for="(item,i) in refLine.lines" :key="i"
									:style="`${item.type == 'x' ? `left: ${item.pos * refLine.w + refLine.x}px;width: 1px;height:100%;cursor: ew-resize;`: `top: ${item.pos * refLine.h + refLine.y}px;width:100%;height:1px;cursor: ns-resize;`}`"
									class="line-item"
									@mousedown.stop="refLineDown($event, item)"
									@click="handleRefLine(i)"
								></div>
							</div>
						</div>

					<!-- 画矩形框选 -->
						<div class="rectDiv" ref="rectDiv" :style="rectSelectStyle"></div>
						<div class="parentDiv" ref="parentDiv">
							<!-- 裁剪框 -->
							<div ref="clipRect" class="img-clip" v-show="isClipImage">
								<img :src="clipImageSrc" draggable="false">
								<div :style="{'background-image': `url(${clipImageSrc})`}" 
									class="clip-box"  
									ref="clipBox" 
									@mousedown="handeImageClipDown">
									<div class="clip-btn clip-right-top-btn"></div>
									<div class="clip-btn clip-right-bottom-btn"></div>
									<div class="clip-btn clip-left-bottom-btn"></div>
									<div class="clip-btn clip-left-top-btn"></div>
									<!-- <div class="clip-btn clip-left-btn"></div>
									<div class="clip-btn clip-top-btn"></div>
									<div class="clip-btn clip-right-btn"></div>
									<div class="clip-btn clip-bottom-btn"></div> -->
									<div class="clip-oper">
										<div class="clip-confirm" @click="setImageClip"></div>
										<div class="clip-cancel" @click="closeClip"></div>
									</div>
								</div>
							</div>
						</div>
					<!-- 底部比例框 -->
						<div v-show="codeTypeTool != 'clip'" class="wheel">
							<span class="wheel-btn" @click="adapt(0)" title="实际大小">1:1</span>
							<span class="wheel-btn" @click="adapt(1)" title="合适大小"></span>
							<span class="wheel-btn" @click="adapt(2)" title="缩小画布"></span>
							<span class="wheel-btn" title="缩放比例">{{setCanvasRatio}}</span>
							<span class="wheel-btn" @click="adapt(3)" title="放大画布"></span>
							<span :class="{'wheel-btn':1, mask: allMask}" title="抓手工具" @click="setMask"></span>
							<span :class="{'wheel-btn':1, 'xifu-active': guide.off && !isClipAdsorb}" @click="toggleGuide" :title="`吸附参考线${guide.off? '(开)': '(关)'}`"></span>
							<div class="wheel-btn" style="width: 60px;" @click="tool_box = tool_box == ''? 'add-ref': ''">
								<span>参考线</span>
								<div class="add-ref-line" v-if="tool_box == 'add-ref'">
									<span class="add-line" @click="addrefline('y')">横向参考线</span>
									<span class="add-line" @click="addrefline('x')">竖向参考线</span>
								</div>
							</div>
						</div>
					<!-- 遮罩 -->
						<div class="all-mask" v-if="allMask" @mousedown="allDown"></div>
						
					</div>
					<!-- 缩放预览窗口 -->
					<div id="pageNavigator" ref="pageViewParent">
						<div class="page-thumb" ref="pageThumb">
							<!-- pageThumbSrc -->
							<img draggable="false" :src="CurrentTemplateDataComputed && CurrentTemplateDataComputed.list[pagenum] && CurrentTemplateDataComputed.list[pagenum].Thumb" alt="">
						</div>
						<div class="page-view"  @mousedown="pageViewBoxDown($event)" ref="pageViewBox"></div>
					</div>
				  <!-- 转换的HTML元素 codebox  -->
					<div  
						v-if="!isClipImage"
						ref="box" 
						@mousedown.stop="handleRecord" 
						@mouseup="setShow" 
                        @mouseenter.stop="handleEnter"
                        @mouseleave.stop="handleLeave"
						:class="{'code-box': true, 'svg-lock': this.svgLock}" 
						:style="codeBoxComputed" 
						@dblclick="handledblclick"
					>
					<div  v-if="textProduction" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 50%;height: 50%;">
						<img style="width: 100%;height: 100%;position: absolute;opacity: .7" src="/img/loadingSvg.svg">
					</div>
						<div>
							<!-- toolType == 'group' ? false : -->
							<div class="resize t-resize-point" v-show=" toolType == 'text' ? false : codeTypeTool == ''? true : codeTypeTool == 'adsorb' ? false : true"></div>
							<div class="resize r-resize-point" v-show=" codeTypeTool == '' ? true : codeTypeTool == 'text' ? true : codeTypeTool == 'adsorb' ? false : true"></div>
							<div class="resize b-resize-point" v-show=" toolType == 'text' ? false : codeTypeTool == ''? true : codeTypeTool == 'adsorb' ? false : true"></div>
							<div class="resize l-resize-point" v-show=" codeTypeTool == '' ? true : codeTypeTool == 'text' ? true : codeTypeTool == 'adsorb' ? false : true"></div>
							<div class="resize lt-resize-point" v-show="codeTypeTool == '' ? true : codeTypeTool == 'adsorb' ? true : false"></div>
							<div class="resize rt-resize-point" v-show="codeTypeTool == '' ? true : codeTypeTool == 'adsorb' ? true : false"></div>
							<div class="resize rb-resize-point" v-show="codeTypeTool == '' ? true : codeTypeTool == 'adsorb' ? true : false"></div>
							<div class="resize lb-resize-point" v-show="codeTypeTool == '' ? true : codeTypeTool == 'adsorb' ? true : false"></div>
							<div class="rotate-btn" v-show="toolType == 'group' ? false : codeTypeTool == ''? true : isClipAdsorb ? false : true"></div>
							<div class="lock-point" v-if="svgLock" @click="lock"></div>
						</div>
						<!-- 文字输入框  v-html="textList.join('')"-->
						<div v-if="codeTypeTool == 'text'" class="text-editor" ref="textEditor">
							<div ref="textHeight" 
							@mouseup="textSelect" 
							@keyup.delete="handleDeleteText"
							class="editor-text" 
							contentEditable="true"
							textedit="true" 
							autofocus
							autocorrect="off" autocomplete="off" spellcheck="off" 
							:style="textStyle">
								<div v-for="(item,i) in textObj.arrList" :key="i">{{item}}</div>
							</div>
						</div>
                       <!-- 右键菜单 -->
					   <div class="right-menu" v-if="rightBtn.show"
							:style="`left:${rightBtn.x}px;top: ${rightBtn.y}px`"
							 @mousedown.stop
							 @dblclick.stop
					   	>
					   		<ul class="menu-ul">
								<li class="menu-li" @click="cloneEnd">
									<span>复制</span><span class="command">Ctrl+ C</span>
								</li>
								<li class="menu-li" @click="del">
									<span>删除</span><span class="command">DELETE</span>
								</li>
								<li class="menu-li" v-if="false">
									<span>组合</span><span class="command" style="display: none">Ctrl+ G</span>
								</li>
								<li class="menu-li" v-if="false">
									<span>锁定</span><span class="command" style="display: none">Ctrl+ L</span>
								</li>
								<li class="hr"></li>
								<li class="menu-li" @click="clearRectSelect">
									<span>取消选中</span>
								</li>
								<li 
									:class="`menu-li ${getElemIndex.up ? '' : 'cant-use'}`"
									@click="getElemIndex.up && makeMove(0)"
								>
									<span>上移一层</span>
								</li>
								<li 
									:class="`menu-li ${getElemIndex.down ? '' : 'cant-use'}`"
									@click="getElemIndex.down && makeMove(1)"
								>
									<span>下移一层</span>
								</li>
								<li 
									:class="`menu-li ${getElemIndex.up ? '' : 'cant-use'}`"
									@click="getElemIndex.up && makeMove(2)"
								>
									<span>置于顶层</span>
								</li>
								<li 
									:class="`menu-li ${getElemIndex.down ? '' : 'cant-use'}`"
									@click="getElemIndex.down && makeMove(3)"
								>
									<span>置于底层</span>
								</li>
								
							</ul>
					   </div>
						<div v-if="toolType == 'adsorb'" class="clip-area" ref="clipArea"></div>
						<img style="position: absolute; top: 0; left: 0; width: 100%; height:100%; opacity: .3;" v-if="toolType == 'background' || isClipAdsorb " 
							:src="backgroundImageUrl">
					</div>
					<!-- 侧边图层栏 -->
					<div class="right-list">
						<div class="right-title">
							<span class="right-title-icon">页面</span>
						</div>
						<TablePage v-if="CurrentTemplateData"
							:pagenum="pagenum"
							:PageMode="PageMode"
							@copyPage="copyPage" 
							@delTemplatePage="delTemplatePage" 
							@toggleTemplatePage="toggleTemplatePage" 
							@handleReversing="handleReversing" 
							:info="CurrentTemplateDataComputed"
						></TablePage>
						<div v-if="PageMode && (CurrentTemplateData.length < PageMode.MaxPages)" class="page-add"  @click="addTemplatePage()"><span class="add-btn">新增页面</span></div>
					</div>
				</div>
				
			</div>
		</div>

		<!-- 复制选中元素 -->
		<div :style="setCopyBoxComputed" class="copyBox" ref="copy">
			<img draggable="false" :src="copyBox.src" alt="">
		</div>
		<!-- 拖拽元素 -->
		<div 
			v-if="dragAndDrop"
			:style="getTextBox"
			ref="DragAndDrop" 
			v-html="dragAndDrop._html"
		class="drag-and-drop"></div>
		<!-- 下载印刷 el-fade-in-linear v-if="dialog.off"-->
		<transition name="el-fade-in-linear">
			<div id="dialogcontent" class="burst-making"  v-show="dialog.off" style="background:rgba(0,0,0,.2);position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 2019;display: flex;justify-content: center;align-items: center;">
				
				<transition name="burstout">
					<Dialog v-if="dialog.off" 
					:info="templateInfo"  
					:Thumb="CurrentTemplateData"
					:dialog="dialog" 
					@close="closeDialog" 
					@setDownType="setDownType"></Dialog>
				</transition>
			</div>
		</transition> 
		<!-- 预览diag -->
		<transition name="el-zoom-in-bottom">
			<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;background: #fff;z-index: 2019" 
				v-if="preview.off">
				<div class="close-btn" @click="preview.off = false"></div>
				<!-- -->
				<Preview 
					v-if=" preview.show" 
					:modelData="preview"
					@handleLoad="preview.wait = false"
					@handleError="preview.msg = '服务器出错,请稍后再试'"
				></Preview>
				<!-- <div  style="width: 100%;height: 100%">
					<img style="width: 100%;height: 100%" :src="$store.state.ossPath + 'materials/201906/73e0342e1e954292b32c3ac0d403fce9.svg'" alt="">
				</div> -->
				<!--  -->
				<div v-if="preview.wait" style="position: absolute;top:0;left:0;width: 100%;height: 100%;text-align:center;display: flex; align-items: center;">
					<DownloadWait v-if="!preview.msg" :width="'50%'"></DownloadWait>
					<div v-if="preview.msg" style="margin: 0 auto;background: #fff;width: 50%;padding: 30px 0;    border-radius: 10px;">
						<img :src="preview.src" alt=""> 
						<p style="margin: 10px 0;">服务器出错,请稍后再试</p>
					</div>
				</div>
			</div>
		</transition>
		<!-- 拾取颜色 -->
		<transition name="diag">
			<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;background: rgba(0,0,0,.2);z-index: 2019" v-if="showPickColor.show">
				<PickColor 
					:oldColor="fontColorSelect"
					@seeColor="seeColor" 
					@closePick="showPickColor.show = false"
				></PickColor>
			</div>
		</transition>
  	  </no-ssr>
	</div>
</template>
<script src="../../components/design/Design.js"></script>

<style lang="scss" scoped>
.design {
  width: 100%;
  height: 100%;
  background: #ebece7;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-width: 960px;
  user-select: none;

  .select-font-size {
    width: 50px;
    height: 30px;
    text-align: center;
    margin-top: 6px;
  }

  .header {
    position: relative;
    z-index: 1000;
    min-width: 1120px;
  }

  .side {
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    z-index: 10;

    // 工具栏
    .tools {
      width: 60px;
      height: 100%;
      background-color: #fff;
      z-index: 10;
      font-size: 14px;
      padding-top: 20px;
      border-right: 1px solid rgba(236, 236, 236, 1);
      .tools-list {
        padding: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        li {
          width: 100%;
          text-align: center;
          padding: 10px 0;
          font-weight: 800;
          letter-spacing: 2px;
          color: #6d6d6d;
          cursor: pointer;
          background: rgba(255, 255, 255, 1);
          .tools-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-repeat: no-repeat;
            background-image: url(/img/desicon/side_icon.png);
            background-position-x: -38px;
          }
          p {
            margin: 0;
          }
          &:nth-child(2) .tools-icon {
            background-position-y: -40px;
          }
          &:nth-child(3) .tools-icon {
            background-position-y: -80px;
          }
          &:nth-child(4) .tools-icon {
            background-position-y: -120px;
          }
          &:nth-child(5) .tools-icon {
            background-position-y: -160px;
          }
          &:nth-child(6) .tools-icon {
            background-position-y: -200px;
          }
        }
        .li-active,
        li:hover {
          background: $gradient;
          color: #fff;
          .tools-icon {
            background-position-x: -1px;
          }
        }
      }
    }

    // 工具面板
  }

  // main start
  .tool-container {
    position: absolute;
    width: 390px;
    height: 100%;
  }

  .design-main {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .toolface {
    position: absolute;
    left: 60px;
    width: 330px;
    height: 100%;
    background: #fff;
    transition: all 0.2s linear;
    z-index: 9;
    padding-bottom: 55px;
    .left-slide-show {
      width: 100%;
      height: 100%;
    }
  }

  .designer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding-left: 390px;
    transition: padding-left 0.3s;
  }

  .editor-container {
    position: relative;
    flex: 1;
    z-index: 10;
    min-width: 794px;
    // 画布预览
    #pageNavigator {
      display: none;
      position: absolute;
      right: 210px;
      bottom: 25px;
      background: #ebece7;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      overflow: hidden;
      z-index: 99;
      .page-thumb {
		  background-color: #fff;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .page-view {
        position: absolute;
        left: 25%;
        top: 25%;
        width: 70px;
        height: 70px;
        z-index: 99;
        border: 2px solid $color;
        cursor: move;
      }
    }
  }

  // 画布
  .editor-page {
    position: relative;
    height: 100%;
    margin-right: 200px;
    overflow: hidden;
    // 顶部工具栏
    .top-tool {
      position: absolute;
      top: 50px;
      left: 0;
      width: 100%;
      height: 40px;
      background: $white;
      border-bottom: 1px solid #ebece7;
      z-index: 9;
      transition: all 0.3s;
      .text-tool,
      .image-tool,
      .group-tool,
      .background-tool {
        height: 100%;
        padding-left: 20px;
        display: flex;
        min-width: 666px;
        position: absolute;
        left: 0;
        top: 0;
      }
      .text-tool {
        .line {
          width: 1px;
          height: 32px;
          background: $line;
          margin-top: 4px;
        }
        .text-item {
          position: relative;
          padding-left: 10px;
        }
        .text-color {
          .item-content {
            width: 100%;
            height: 100%;
            padding: 8px 0;
            .item-content-color {
              display: block;
              width: 24px;
              height: 24px;
			  margin: 0 10px;
			  border: 1px solid #ccc;
              border-radius: 3px;
              outline: none;
              cursor: pointer;
            }
          }
        }
        .text-font {
          width: 200px;
          padding: 10px 0 10px 10px;
          .text-img {
            width: 180px;
            height: 20px;
            margin: 0 auto;
            cursor: pointer;
            img {
              height: 100%;
            }
          }
          .family-list {
            width: 213px;
            height: 300px;
            overflow-x: hidden;
            overflow-y: auto;
            padding-top: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            .family-type {
              height: 32px;
              display: flex;
              justify-content: space-around;
              padding: 4px 0;
              span {
                display: inline-block;
                height: 22px;
                font-size: 12px;
                padding: 3px 10px;
                border: 1px solid $line;
                border-radius: 3px;
                cursor: pointer;
              }
              .type-active {
                background: $color;
                color: $white;
              }
            }
            .family-item {
              padding: 3px 10px;
              cursor: pointer;
              .family-value {
                height: 25px;
                img {
                  height: 100%;
                }
              }
              &:hover {
                background: rgba(0, 0, 0, 0.2);
              }
            }
          }
        }
        .text-size {
          width: 100px;
          font-size: 14px;
          line-height: 40px;
          input {
            width: 60px;
            outline: none;
            border: none;
          }
          .size-list {
            width: 86px;
            height: 300px;
            overflow-x: hidden;
            overflow-y: auto;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            .size-item {
              padding-left: 10px;
              height: 30px;
              line-height: 30px;
              cursor: pointer;
              &:hover {
                background: rgba(0, 0, 0, 0.2);
              }
            }
          }
        }
        .text-style {
          padding: 10px;
          width: 130px;
          display: flex;
          justify-content: space-around;
          .text-style-item {
            width: 23px;
            height: 22px;
            padding: 0;
          }
          .text-item-bold {
            position: relative;
            .text-item-bold-content {
              position: absolute;
              top: 35px;
              left: -105px;
			  display: flex;
			  background: #fff;
              width: 250px;
              height: 35px;
              font-size: 14px;
              padding-left: 10px;
              align-items: center;
              span:first-child {
                margin-right: 10px;
              }
              span:last-child {
                margin: 0 0 0 10px;
                width: 38px;
                height: 23px;
                background: #e5e5e5;
                border-radius: 3px;
                text-align: center;
                line-height: 23px;
                font-size: 12px;
              }
            }

            .san {
              position: absolute;
              top: -10px;
              left: 45%;
              width: 0;
              height: 0;
              border: 6px solid transparent;
              border-bottom-color: $white;
            }
          }
          .italic,
          .underline,
          .bold {
            background-repeat: no-repeat;
            background-position: 1px -1px;
            cursor: pointer;
            outline: none;
          }
          .italic {
            background-image: url(/img/desicon/text_style.png);
          }
          .underline {
            background-image: url(/img/desicon/text_style.png);
            background-position-x: -20px;
          }
          .bold {
            background-image: url(/img/desicon/text_style.png);
            background-position-x: -40px;
          }
          .active {
            background-position-y: -21px;
          }
        }
		.text-conversion {
			padding: 10px 0;
			font-size: 18px;
			cursor: pointer;
			outline: none;
			position: relative;
			&:hover {
				color: $color;
			}
			&:hover::before {
				content: attr(data-tip);
				font-size: 12px;
				line-height: 12px;
				background-color: #fff;
				color: #626262;
				padding: 4px 8px;
				position: absolute;
				top: 44px;
				left: -24.5px;
				white-space: pre;
				border-radius: 2px;
				box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.24);
			}
			&:hover::after {
				content: "";
				position: absolute;
				width: 0;
				height: 0;
				border-bottom: 4px solid #fff;
				border-left: 4px solid transparent;
				border-right: 4px solid transparent;
				top: 40px;
				left: 5.5px;
			}
		}

        .align-check {
          padding: 10px;
          width: 80px;
          display: flex;
          justify-content: space-around;
          .choose-active {
            display: flex;
            left: -50px;
            .board {
              left: 67px;
            }
            .choose-item {
              padding: 5px 10px;
              cursor: pointer;
              span {
                display: inline-block;
                width: 20px;
                height: 20px;
                background-size: 100%;
                background-repeat: no-repeat;
              }
              .align-left {
                background-image: url(/img/desicon/topTool/wzz_icon.png);
                &:hover {
                  background-image: url(/img/desicon/topTool/wzz_blue_icon.png);
                }
              }
              .align-center {
                background-image: url(/img/desicon/topTool/wzzh_icon.png);
                &:hover {
                  background-image: url(/img/desicon/topTool/wzzh_blue_icon.png);
                }
              }
              .align-right {
                background-image: url(/img/desicon/topTool/wzy_icon.png);
                &:hover {
                  background-image: url(/img/desicon/topTool/wzy_blue_icon.png);
                }
              }
              .align-fenbu {
                background-image: url(/img/desicon/topTool/wzdz_icon.png);
                &:hover {
                  background-image: url(/img/desicon/topTool/wzd_blue_icon.png);
                }
              }
            }
          }
          .align-check-choose {
            width: 20px;
            height: 20px;
            background-repeat: no-repeat;
            background-image: url(/img/desicon/topTool/edit_icon.svg);
            background-position: -30px 2px;
            cursor: pointer;
            outline: none;
            &:hover {
              background-position-y: -18px;
            }
          }
          .check-spacing {
            width: 20px;
            height: 20px;
            cursor: pointer;
            outline: none;
            background-repeat: no-repeat;
            background-image: url(/img/desicon/topTool/space_icon.png);
            &:hover {
              background-image: url(/img/desicon/topTool/space_blue_icon.png);
            }
          }
          .text-spacing {
            left: -70px;
            .board {
              left: 120px;
            }
          }
          .spacing-list {
            width: 274px;
            height: 79px;
            font-size: 14px;
            padding-left: 10px;
            .spacing-item {
              height: 50%;
              display: flex;
              align-items: center;

              span {
                display: inline-block;
                margin-right: 10px;
              }
              span:last-child {
                margin: 0 0 0 10px;
                width: 38px;
                height: 23px;
                background: $input;
                border-radius: 3px;
                text-align: center;
                line-height: 23px;
                font-size: 12px;
              }
            }
          }
        }

        .change-family,
        .change-size {
          position: absolute;
          right: 20px;
          top: 0;
          width: 12px;
          height: 100%;
          padding: 6px 0;
        }
        .item-active {
          position: absolute;
          top: 50px;
          left: 0;
          background: $white;
          z-index: 99;
          border-radius: 3px;
        }
      }
      .image-tool {
        font-size: 14px;
        .image-size,
        .image-clip,
        .image-background,
        .image-reset {
          position: relative;
          &:hover::before {
            content: attr(data-tip);
            font-size: 12px;
            line-height: 12px;
            background-color: #fff;
            color: #626262;
            padding: 4px 8px;
            position: absolute;
            top: 49px;
            left: -0.5px;
            white-space: pre;
            border-radius: 2px;
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.24);
          }
          &:hover::after {
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border-bottom: 4px solid #fff;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            top: 45px;
            left: 15.5px;
          }
        }
        .image-item {
          height: 100%;
          padding: 7px 10px;
          cursor: pointer;
          .image-icon {
            display: inline-block;
            width: 22px;
            height: 22px;
            background-repeat: no-repeat;
            background-position: 1px -3px;
            background-image: url(/img/desicon/topTool/image_tool.png);
            position: relative;
            &::before {
              content: "";
              position: absolute;
              top: -5px;
              left: -5px;
              width: 140%;
              height: 140%;
              border-radius: 4px;
            }
          }
          &:hover .image-icon {
            background-position-y: -26px;
          }
          &:hover .image-icon::before {
            border: 1px solid $color;
          }
        }
        .image-clip .image-icon {
          background-position-x: -25px;
        }
        .image-background .image-icon {
          background-position-x: -53px;
        }
        .image-reset .image-icon {
          background-position-x: -80px;
        }
        .image-size .image-active {
          position: absolute;
          top: 50px;
          left: 0;
          width: 120px;
          height: 100px;
          background: $white;
          z-index: 99;
          border-radius: 3px;
        }
        .image-active {
          padding: 8px;
          display: flex;
          flex-direction: column;
          .size-item {
            flex: 1;
            font-size: 14px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            input {
              width: 60px;
              outline: none;
            }
          }
          .size-item:last-child {
            justify-content: space-around;
            span {
              display: inline-block;
              font-size: 12px;
              font-family: MicrosoftYaHei;
              padding: 2px 5px;
              border: 1px solid $line;
              border-radius: 3px;
              &:hover {
                color: $white;
                background: $color;
              }
            }
          }
        }
      }
      .image-tool .svg-tool {
        height: 100%;
        padding: 7px 10px;
        display: flex;
        position: relative;
        .svg-fill-list {
          position: relative;
          width: 25px;
          height: 25px;
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.3);
          margin-right: 10px;
          &:hover {
            box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.8);
          }
        }
        .svg-fill-active {
          position: absolute;
          top: 50px;
          left: 0;
        //   width: 209px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          border-radius: 3px;
        //   padding: 10px 10px 0 10px;
          .fill-default,
          .fill-zhuti {
            display: flex;
            flex-wrap: wrap;
            padding: 10px 7px;
          }
          .fill-default {
            .fill-default-item {
              width: 25px;
              height: 25px;
              border-radius: 3px;
              cursor: pointer;
              margin-right: 5px;
              margin-bottom: 8px;
              box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.16);
              transition: all 0.3s;
              &:hover {
                transform: scale(1.1);
                box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.32);
              }
            }
            .fill-default-item:nth-child(6n) {
              margin-right: 0;
            }
          }
        }
      }
      .group-tool {
		  .group-text {
			  position: relative;
			  width: 45px;
			  height: 39px;
		  }
		  .group-text-active {
			  position: absolute;
    			top: 46px;
				background: #fff;
		  }
		  .group-text-content {
            width: 100%;
            height: 100%;
            padding: 8px 0;
            .group-text-content-color {
              display: block;
              width: 24px;
              height: 24px;
			  margin: 0 10px;
			  border: 1px solid #ccc;
              border-radius: 3px;
              outline: none;
              cursor: pointer;
            }
          }
        .group-item {
          position: relative;
          &:hover::before {
            content: attr(data-tip);
            font-size: 12px;
            line-height: 12px;
            background-color: #fff;
            color: #626262;
            padding: 4px 8px;
            position: absolute;
            top: 49px;
            left: -0.5px;
            white-space: pre;
            border-radius: 2px;
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.24);
          }
          &:hover::after {
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            border-bottom: 4px solid #fff;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            top: 45px;
            left: 15.5px;
          }
        }
        .group-item {
          padding: 7px 10px;
          .group-icon {
            display: inline-block;
            width: 25px;
            height: 25px;
            background-repeat: no-repeat;
            background-position: 50%;
            border: 1px solid $line;
            border-radius: 3px;
            cursor: pointer;
            &:hover {
              border: 1px solid $color;
            }
          }
          .group-box {
            background-image: url(/img/desicon/topTool/group_icon.png);
            &:hover {
              background-image: url(/img/desicon/topTool/group_blue_icon.png);
            }
          }
          .group-align {
            background-image: url(/img/desicon/topTool/zdq_icon.png);
            &:hover {
              background-image: url(/img/desicon/topTool/zdq_blue_icon.png);
            }
          }
          .group-fenbu {
            background-image: url(/img/desicon/topTool/tcdq_icon.png);
            &:hover {
              background-image: url(/img/desicon/topTool/tcdq_blue_icon.png);
            }
          }
        }
        .group-align-active {
          position: absolute;
          top: 50px;
          left: 0;
          width: 100px;
          font-size: 14px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          border-radius: 3px;
          z-index: 9;
          .group-align-item {
            height: 30px;
            padding-left: 30px;
            line-height: 30px;
            position: relative;
            cursor: pointer;
            &:hover {
              background: rgba(0, 0, 0, 0.2);
              color: $color;
            }
            &:hover .g-align {
              background-position-x: -19px;
            }
            &:hover .x-fenbu {
              background-image: url(/img/desicon/topTool/sf_blue_icon.png);
            }
            &:hover .y-fenbu {
              background-image: url(/img/desicon/topTool/tcdq_blue_icon.png);
            }
            .g-align {
              position: absolute;
              top: 4px;
              left: 4px;
              width: 22px;
              height: 22px;
              background-repeat: no-repeat;
              background-image: url(/img/desicon/topTool/canvas_blue_icon.png);
            }
            .x-middle {
              background-position-y: -20px;
            }
            .right {
              background-position-y: -40px;
            }
            .y-middle {
              background-position-y: -78px;
            }
            .top {
              background-position-y: -58px;
            }
            .bottom {
              background-position-y: -96px;
            }
            .x-fenbu,
            .y-fenbu {
              position: absolute;
              top: 4px;
              left: 4px;
              width: 22px;
              height: 22px;
              background-repeat: no-repeat;
            }
            .x-fenbu {
              background-image: url(/img/desicon/topTool/sf_icon.png);
            }
            .y-fenbu {
              background-image: url(/img/desicon/topTool/tcdq_icon.png);
            }
          }
        }
      }
      .background-tool {
        .background-item {
          height: 100%;
          font-size: 14px;
          padding: 6px 0;
          .span-btn {
            display: inline-block;
            padding: 3px 5px;
            border: 1px solid $line;
            border-radius: 3px;
            cursor: pointer;
            &:hover {
              color: $color;
              border: 1px solid $color;
            }
          }
        }
      }
    }
  }

  .editor-page {
    .operate {
      position: absolute;
      right: 0;
      top: 90px;
      width: 90px;
      background: $white;
      z-index: 9;
      transition: all 0.3s;
      .right-tool {
        position: relative;
        height: 40px;
        font-size: 16px;
        &:hover .tool-title span {
          background-position-x: -24px;
          color: $color;
        }
        .tool-title {
          height: 100%;
          text-align: right;
          display: flex;
          justify-content: space-around;
          align-items: center;
          cursor: pointer;
          span {
            display: inline-block;
          }
          span:first-child {
            width: 24px;
            height: 24px;
            background-repeat: no-repeat;
            background-image: url(/img/desicon/right_tool.png);
          }
        }
        .tool-active span {
          background-position-x: -24px;
          color: $color;
        }

        .tool-copy span:first-child {
          background-position-y: -5px;
        }
        .tool-sort span:first-child {
          background-position-y: -30px;
        }
        .tool-opacity span:first-child {
          background-position-y: -53px;
        }
        .tool-projection span:first-child {
          background-position-y: -77px;
        }
        .tool-reverse span:first-child {
          background-position-y: -100px;
        }
        .tool-collect span:first-child {
          background-position-y: -122px;
        }
        .tool-lock span:first-child {
          background-position-y: -148px;
        }
        .tool-del span:first-child {
          background-position-y: -170px;
        }
      }
      .right-tool {
        .right-tool-active {
          position: absolute;
          top: 0;
          right: 100px;
          background: $white;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          .right-tool-board {
            position: absolute;
            top: 15px;
            right: -12px;
            width: 0;
            height: 0;
            border: 6px solid transparent;
            border-left-color: $white;
          }
        }
        .make-move {
          width: 133px;
          font-size: 14px;
          .move-icon {
            height: 36px;
            line-height: 36px;
            cursor: pointer;
            padding-left: 40px;
            position: relative;
            &:hover {
              background-color: rgba(0, 0, 0, 0.2);
            }
            span {
              position: absolute;
              left: 8px;
              top: 8px;
              display: inline-block;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              background-image: url(/img/desicon/make_move.png);
              background-position-x: -1px;
            }
            &:hover {
              color: $color;
              span {
                background-position-x: -20px;
              }
            }
          }
		  .cant-use {
				cursor: default;
    			opacity: .3;
				&:hover {
					color: #626262;
					background: #fff;
				}
			}
          .move-top span {
            background-position-y: -2px;
          }
          .move-bottom span {
            background-position-y: -20px;
          }
          .move-best-top span {
            background-position-y: -40px;
          }
          .move-best-bottom span {
            background-position-y: -60px;
          }
        }
        .make-opacity {
          display: flex;
          width: 274px;
          height: 46px;
          font-size: 14px;
          padding-left: 10px;
          align-items: center;
          span:first-child {
            margin-right: 10px;
          }
          span:last-child {
            margin: 0 0 0 10px;
            width: 38px;
            height: 23px;
            background: #e5e5e5;
            border-radius: 3px;
            text-align: center;
            line-height: 23px;
            font-size: 12px;
          }
        }
        .tool_projection {
          width: 280px;
          padding: 10px;
          .projection-control {
            border-top: 1px solid $line;
            border-bottom: 1px solid $line;
            padding: 10px 0;
            .projection-control-item {
              font-size: 14px;
              display: flex;
              align-items: center;
              span:first-child {
                margin-right: 10px;
                width: 50px;
              }
              span:last-child {
                margin: 0 0 0 10px;
                width: 38px;
                height: 23px;
                background: #e5e5e5;
                border-radius: 3px;
                text-align: center;
                line-height: 23px;
                font-size: 12px;
              }
            }
          }
          .projection-control-off {
            padding-top: 10px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
          }
        }
        .tool_reverse {
          width: 120px;
          height: 80px;
          .reverse-x,
          .reverse-y {
            position: relative;
            height: 40px;
            line-height: 40px;
            padding-left: 40px;
            cursor: pointer;
            span {
              position: absolute;
              top: 10px;
              left: 10px;
              display: inline-block;
              width: 20px;
              height: 20px;
              background-repeat: no-repeat;
              background-image: url(/img/desicon/reverse.png);
            }
            &:hover span,
            &:hover {
              background-position-x: -21px;
              color: $color;
            }
          }
          .reverse-x span {
            background-position: 0 0;
          }
          .reverse-y span {
            background-position: 0 -20px;
          }
        }
      }
    }
  }
  // 小三角
  .editor-page {
    .board {
      position: absolute;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-bottom-color: #fff;
      top: -12px;
      left: 15px;
    }
  }
  // 上下箭头
  .resize-btn {
    display: block;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    cursor: pointer;
  }
  .number-up {
    margin-bottom: 4px;
    border-bottom-color: $unchecked;
    &:hover {
      border-bottom-color: $color;
    }
  }
  .number-down {
    border-top-color: $unchecked;
    &:hover {
      border-top-color: $color;
    }
  }

  // 编辑的画布
  .editor-svg {
    position: absolute;
    left: 0;
    top: 50px;
    bottom: 0;
    width: 100%;
    .canvas {
      position: absolute;
      background: #fff;
    }

    .editor-box {
      position: absolute;
      pointer-events: none;
      display: none;
      z-index: 10;

      .editor-box-rect {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border: 1px solid #fff;
        }

        &:after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border: 1px dashed rgba(0, 0, 0, 0.5);
          z-index: 10;
        }
      }

      .resize {
        position: absolute;
        width: 14px;
        height: 14px;
        z-index: 1;
        background-image: url(/img/desicon/dartboard.svg?v=1233);
        background-repeat: no-repeat;
        background-position-x: 0;
        right: -8px;
        bottom: -8px;
      }

      .lt-resize-point {
        left: -8px;
        top: -8px;
        background-position-y: -24px;

        &:hover {
          cursor: nwse-resize;
          background-position-x: -24px;
        }
      }

      .rt-resize-point {
        right: -8px;
        top: -8px;
        background-position-y: 0;

        &:hover {
          cursor: nesw-resize;
          background-position-x: -24px;
        }
      }

      .rb-resize-point {
        right: -8px;
        bottom: -8px;
        background-position-y: -72px;

        &:hover {
          cursor: nwse-resize;
          background-position-x: -24px;
        }
      }

      .lb-resize-point {
        left: -8px;
        bottom: -8px;
        background-position-y: -48px;

        &:hover {
          cursor: nesw-resize;
          background-position-x: -24px;
        }
      }
    }
  }

  // main end

  // 右侧边栏
  .right-list {
    position: absolute;
    right: 0;
    top: 50px;
    bottom: 0;
    width: 200px;
    min-height: 600px;
    background: #fff;
    z-index: 10;
    font-size: 14px;
    border-left: 1px solid #ebece7;
	padding-bottom: 90px;
    .right-title {
      height: 40px;
      text-align: center;
      line-height: 42px;
      border-bottom: 1px solid rgba(236, 236, 236, 1);
      border-left: 1px solid rgba(236, 236, 236, 1);
      margin-left: -1px;
      .right-title-icon {
        display: inline-block;
        padding-left: 30px;
        background: url(/img/page_icon.png) no-repeat 0 50%;
      }
    }
    .page-add {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 49px;
      text-align: center;
      line-height: 49px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      background: $color;
      transition: 0.3s;
      .add-btn {
        display: inline-block;
        padding-left: 30px;
        background: url(/img/desicon/add_page_icon.png) no-repeat 0 50%;
      }
    }
  }

  // 切换样式
  .toggle {
    position: absolute;
    right: -18px;
    top: 50%;
    margin-top: -45px;
    background: url(/img/desicon/toggle.png) no-repeat;
    background-size: 18px 90px;
    width: 18px;
    height: 90px;
    cursor: pointer;
    transition: all 0.2s linear;
    line-height: 90px;
    font-size: 20px;
    text-align: center;
    z-index: 1;
  }

  .active-toggle {
    transform: translateX(-100%);
  }

  .active-toggle-btn {
    transform: translateX(-330px);
  }

  // svg 选中
  .svg_select_points:hover {
    fill: "#00c1de";
  }

  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 4px;
    height: 8px;
    background-color: #f5f5f5;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 6px #949492;
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    // -webkit-box-shadow: inset 0 0 6px #949492;
    background-color: #cfcfcf;
  }

  // 矩形框选
  .parentDiv {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    // pointer-events: none;
  }

  .rectDiv {
    position: absolute;
    background: #5a72f8;
    border: 1px solid #257fb4;
    width: 0;
    height: 0;
    opacity: 0.2;
    pointer-events: none;
  }

  .svg_select_points {
    pointer-events: none;
  }

  // 控制画布大小
  .wheel {
    position: absolute;
    left: 50%;
    bottom: 25px;
    transform: translateX(-50%);
    height: 34px;
    display: flex;
    background: #fff;
    line-height: 34px;
    color: $unchecked;
	box-shadow: 0 1px 6px 0 rgba(0,0,0,0.2);
	z-index: 11;
    .wheel-btn {
      display: inline-block;
      width: 40px;
      text-align: center;
      position: relative;
      &:not(:nth-child(4)) {
        cursor: pointer;
		&:hover {
			background-color: #ECECEC;
		}
      }
      &:not(:last-child) {
        border-right: 1px solid $line;
      }
      &:nth-child(2) {
		  background: url(/img/desicon/bottom/bili.png) no-repeat;
		  background-size: 40%;
		  background-position: 50%;
      }
	  &:nth-child(3), &:nth-child(4) {
		  border: none;
	  }
      &:nth-child(3)::before {
		 
        content: "";
        display: block;
        width: 12px;
        height: 2px;
        background: #ccc;
        margin: 16px auto;
      }
	  &:nth-child(4) {
		  width: 70px;
	  }
      &:nth-child(5) {
        &::before {
          content: "";
          display: block;
          width: 12px;
          height: 2px;
          background: #ccc;
          margin: 16px auto;
        }
        &::after {
          content: "";
          display: block;
          width: 2px;
          height: 12px;
          background: #ccc;
          margin: -23px auto 0 auto;
        }
      }
	  &:nth-child(6) {
		background-repeat: no-repeat;
		background-image: url(/img/desicon/bottom/zhuangshou.png);
		background-size: 50%;
		background-position: 50%;
			&.mask {
				background-image: url(/img/desicon/bottom/zhuangshou_active.png);
			}
	  }
	  &:nth-child(7) {
			background-repeat: no-repeat;
			background-image: url(/img/desicon/bottom/xifu.png);
			background-size: 50%;
			background-position: 50%;
			&.xifu-active {
				background-image: url(/img/desicon/bottom/xifu_active.png);
			}
	  }
	}
	.add-ref-line {
		position: absolute;
		top: -58px;
		left: -20px;
		width: 100px;
		height: 48px;
		font-size: 14px;
		line-height: 24px;
		box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
		background: #fff;
		.add-line {
			display: block;
			&:hover {
				background-color: #ECECEC;
			}
		}
		
	}
	.add-ref-line::after {
		content: '';
		position: absolute;
		left: 45px;
		bottom: -11px;
		width: 0;
		height: 0;
		border: 6px solid transparent;
		border-top-color: #fff;
	}
  }

  /*
	输入文本框
*/
  .cloneBox {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
  }

 

  .hoveMove {
    cursor: move;
  }

  .code-box {
    position: fixed;
    cursor: move;
    transform: all 0.3s;
	.text-editor{
		position: relative;
		z-index: 10;
	}
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border: 1px solid #fff;
	  z-index: 3;
    }

    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border: 1px dashed rgba(0, 0, 0, 0.5);
	  z-index: 3;
    }

    .resize {
      position: absolute;
      width: 14px;
      height: 14px;
      z-index: 1;
      background-image: url(/img/desicon/dartboard.svg);
      background-repeat: no-repeat;
      background-position-x: 0;
      right: -8px;
      bottom: -8px;
      pointer-events: auto;
    }

    .t-resize-point {
      top: -7px;
      left: 50%;
      margin-left: -7px;
      z-index: 2;
      background-position-y: -96px;

      &:hover,
      &:active {
        cursor: ns-resize;
        background-position-x: -24px;
      }
    }

    .r-resize-point {
      top: 50%;
      margin-top: -7px;
      right: -13px;
      z-index: 2;
      background-position-y: -168px;

      &:hover,
      &:active {
        cursor: ew-resize;
        background-position-x: -24px;
      }
    }

    .b-resize-point {
      bottom: -9px;
      left: 50%;
      margin-left: -7px;
      z-index: 2;
      background-position-y: -116px;

      &:hover,
      &:active {
        cursor: ns-resize;
        background-position-x: -24px;
      }
    }

    .l-resize-point {
      top: 50%;
      margin-top: -7px;
      left: -8px;
      z-index: 2;
      background-position-y: -144px;

      &:hover,
      &:active {
        cursor: ew-resize;
        background-position-x: -24px;
      }
    }

    .lt-resize-point {
      left: -8px;
      top: -8px;
      background-position-y: -24px;

      &:hover,
      &:active {
        cursor: nwse-resize;
        background-position-x: -24px;
      }
    }

    .rt-resize-point {
      right: -8px;
      top: -8px;
      background-position-y: 0;

      &:hover,
      &:active {
        cursor: nesw-resize;
        background-position-x: -24px;
      }
    }

    .rb-resize-point {
      right: -8px;
      bottom: -8px;
      background-position-y: -72px;

      &:hover,
      &:active {
        cursor: nwse-resize;
        background-position-x: -24px;
      }
    }

    .lb-resize-point {
      left: -8px;
      bottom: -8px;
      background-position-y: -48px;

      &:hover,
      &:active {
        cursor: nesw-resize;
        background-position-x: -24px;
      }
    }

    // 旋转
    .rotate-btn {
      width: 0;
      height: 40px;
      margin: 0 auto;
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
		pointer-events: auto;
      &::before {
        content: "";
        position: absolute;
        top: 16px;
        left: -10px;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: url(/img/desicon/dartboard.svg) 0 -192px;
        cursor: pointer;
      }

      &:hover::before,
      &:active::before {
        background: url(/img/desicon/dartboard.svg) -30px -192px;
      }

      &::after {
        content: "";
        display: block;
        position: absolute;
        left: 50%;
        height: 16px;
        border-left: 1px dashed #9b9b9b;
      }
    }
  }
  // 吸附框裁切
  .clip-area {
    position: absolute;
    border: 1px dashed rgba(0, 0, 0, 0.5);
  }
  // 锁定状态
  .svg-lock {
    cursor: auto;
	pointer-events: none;
    &::after {
      border: 1px dashed #ff3d67;
    }
    .resize,
    .rotate-btn {
      display: none;
    }

    .lock-point {
      position: absolute;
      right: -10px;
      bottom: -10px;
      width: 20px;
      height: 20px;
      padding: 3px;
      z-index: 5;
      cursor: pointer;
	  pointer-events: auto;
      &::before {
        content: "";
        display: block;
        width: 10px;
        height: 10px;
        background: #ff3d67;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.15);
      }
    }
  }

  // 裁剪框
  .img-clip {
    position: fixed;
    z-index: 2;
    background: #fff;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.5;
    }
  }
// 裁剪盒子
.clip-box {
	position: absolute;
	cursor: move;
	width: 100px;
	height: 100px;
	z-index: 5;
	background-repeat: no-repeat;
	.clip-btn {
	width: 20px;
	height: 20px;
	position: absolute;

	&::before {
		content: "";
		display: block;
		position: absolute;
		width: 2px;
		height: 13px;
		border: 1px solid #fff;
		background-color: #000;
	}

	&:after {
		content: "";
		display: block;
		position: absolute;
		height: 2px;
		width: 10px;
		border: 1px solid #fff;
		background-color: #000;
	}
	}

	.clip-right-top-btn {
	right: -8px;
	top: -8px;
	cursor: ne-resize;

	&::before {
		right: 4px;
		top: 4px;
		box-shadow: -2px 2px 3px rgba(0, 0, 0, 0.25);
	}

	&:after {
		right: 7px;
		bottom: 12px;
		border-right: none;
		box-shadow: -2px 2px 3px rgba(0, 0, 0, 0.25);
	}
	}

	.clip-right-bottom-btn {
	right: -8px;
	bottom: -8px;
	cursor: se-resize;

	&::before {
		right: 4px;
		bottom: 4px;
		box-shadow: -2px -2px 3px rgba(0, 0, 0, 0.25);
	}

	&:after {
		right: 7px;
		top: 12px;
		border-right: none;
		box-shadow: -2px -2px 3px rgba(0, 0, 0, 0.25);
	}
	}

	.clip-left-bottom-btn {
	left: -8px;
	bottom: -8px;
	cursor: sw-resize;

	&::before {
		left: 4px;
		top: 1px;
	}

	&:after {
		left: 7px;
		top: 12px;
		border-left: none;
	}
	}

	.clip-left-top-btn {
	left: -8px;
	top: -8px;
	cursor: nw-resize;

	&::before {
		left: 4px;
		top: 4px;
	}

	&:after {
		left: 7px;
		top: 4px;
		border-left: none;
	}
	}
	.clip-left-btn {
	left: -8px;
	top: 50%;
	cursor: nw-resize;
	&::before {
		left: 4px;
		top: 4px;
	}
	&:after {
		display: none;
	}
	}

	.clip-oper {
	position: absolute;
	top: 0;
	right: -48px;
	width: 32px;
	height: 64px;
	background: #fff;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.24);
	cursor: auto;

	.clip-confirm {
		width: 32px;
		height: 32px;
		display: block;
		padding: 6px;
		box-sizing: border-box;
		overflow: hidden;
		cursor: pointer;

		&::before {
		content: "";
		width: 30px;
		height: 45px;
		display: block;
		background: url(/img/desicon/confirm_new.svg) no-repeat;
		}

		&:hover:before {
		background-position-y: -22.5px;
		}
	}

	.clip-cancel {
		width: 32px;
		height: 32px;
		display: block;
		padding: 6px;
		box-sizing: border-box;
		overflow: hidden;
		cursor: pointer;

		&::before {
		content: "";
		width: 30px;
		height: 47px;
		display: block;
		background: url(/img/desicon/cancel_new.svg) no-repeat;
		}

		&:hover:before {
		background-position-y: -23.5px;
		}
	}
	}
}
  // 文字盒子
  .editor-text {
    width: 100%;
    position: relative;
    z-index: 11;
    letter-spacing: 2px;
    outline: none;
    overflow: hidden;
    cursor: text;
    // user-select: text;
    // transform-origin: 0px 0px 0px;
    word-break: break-all;
	// transform: scale(1, 1);
	
  }
	.drag-and-drop {
		position: absolute;
		pointer-events: none;
		z-index: 2019;
		text-align: center;
	}
  //复制盒子
  .copyBox {
    position: absolute;
    display: none;
    z-index: 2019;
    pointer-events: none;
    img {
      width: 100%;
    }

    cursor: move;
  }
  // 设计作品标题
  .design_title_input {
    margin: 0 auto;
    margin-top: -50px;
    width: 300px;
    height: 50px;
    position: relative;
    z-index: 100;
    overflow: hidden;
    .works {
      background: transparent;
      text-align: center;
      width: 100%;
      height: 100%;
      border: none;
      color: #000;
      font-size: 16px;
      outline: none;
      &::-webkit-input-placeholder {
        color: #000;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  // 全屏遮罩
  .all-mask {
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  z-index: 10;
	  cursor: grab;
  }
  // 吸附引导线
  .move-guide {
	  .guide-item {
		  position: absolute;
		  border: .5px dashed red;
	  }
	  .elem {
		  position: absolute;
		  border: .5px dashed rgba(121,121,121,1);
	  }
		.guide-left {
			left: 0;
			top: 0;
			height: 100%;
		}
		.guide-top {
			left: 0;
			top: 0;
			width: 100%;
		}
		.guide-right {
			right: 0;
			top: 0;
			height: 100%;
		}
		.guide-bottom {
			left: 0;
			bottom: 0;
			width: 100%;
		}
		.guide-cx {
			left: 50%;
			top: 0;
			height: 100%;
		}
		.guide-cy {
			left: 0;
			top: 50%;
			width: 100%;
		}
  }
	//出血线
	.out-blood-line {
		pointer-events: none;
		.bleed-top {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
		}
		.bleed-right {
			position: absolute;
			right: 0;
			border-left: 1px dashed $bleed;
		}
		.bleed-bottom {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
		}
		.bleed-left {
			position: absolute;
			left: 0;
			border-right: 1px dashed $bleed;
		}
		.bleed-line {
			height: 0;
			border-bottom: 1px dashed $bleed;
			position: absolute;
		}
		// .bleed-border {
		// 	// background-color: rgba(255,255,255,.5);
		// }
		.bleed_ruler {
    		position: absolute;
			background-color: $bleed;
		}
		.bleed_ruler_top_left, 
		.bleed_ruler_top_right, 
		.bleed_ruler_bottom_right,
		.bleed_ruler_bottom_left {
			width: 10px;
			height: 1px;
		}
		.bleed_ruler_right_top,
		.bleed_ruler_right_bottom,
		.bleed_ruler_left_top,
		.bleed_ruler_left_bottom {
			width: 1px;
			height: 10px;
		}
		.bleed_ruler_top_left,
		.bleed_ruler_bottom_left {
			left: -14px;
		}
		.bleed_ruler_top_right,
		.bleed_ruler_bottom_right {
			right: -14px;
		}
		.bleed_ruler_right_top,
		.bleed_ruler_left_top {
			top: -14px;
		}
		.bleed_ruler_right_bottom,
		.bleed_ruler_left_bottom {
			bottom: -14px;
		}

	}

// 右键菜单
.right-menu {
	position: absolute;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    overflow: hidden;
	z-index: 4;
	.menu-ul {
		width: 164px;
		.menu-li {
			display: flex;
			align-items: center;
			line-height: 30px;
			padding: 0 16px;
			font-size: 14px;
			color: #626262;
			cursor: pointer;
			&:hover {
				color: $color;
				background-color: #F8F8F8;
			}
			.command {
				display: flex;
				align-items: center;
				margin-left: auto;
			}
		}
		.cant-use {
			cursor: default;
    		opacity: .3;
			&:hover {
				color: #626262;
    			background: #fff;
			}
		}
	}
	.hr {
		height: 1px;
		background-color: #CDCDCD;
		box-shadow: inset 0 -1px 0 0 #DDDDDD;
	}
}

// 参考线
.ref-line {
	.line-item {
		position: absolute;
		background-color: #F93310;
		&::after {
			content: "";
			position: absolute;
			left: -6px;
			right: -6px;
			top: -6px;
			bottom: -6px;
		}
	}
}

  /*动画 start*/

  // 顶部工具栏动画
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  // 左侧面板动画
  .left-show-enter-active {
    transition: all 0.3s;
    width: 100%;
  }
  .left-show-enter {
    transform: translateX(-330px);
  }
  .left-show-leave-to {
    display: none;
  }
  // 弹框动画

  .diag-enter,
  .diag-leave-to {
	  opacity: 0;
  }
  .diag-enter-active,
  .diag-leave-active {
	  transition: opacity .3s;
  }
  
  /*动画 end*/

  // element-ui 设定
  // 滑块
  .el-slider {
    width: 150px;
  }
  .el-slider /deep/ .el-slider__runway,
  .el-slider /deep/ .el-slider__bar {
    height: 2px;
  }
  .el-slider /deep/ .el-slider__bar {
    background-color: $color;
  }
  .el-slider /deep/ .el-slider__button.el-tooltip {
    background-color: $color;
    width: 10px;
    height: 10px;
    border: 1px solid #409eff;
  }
  .el-slider /deep/ .el-slider__button-wrapper {
    top: -17px;
  }
  // 取色器
  .el-color-picker /deep/ .el-color-picker__color-inner {
		background-image: url(/img/desicon/topTool/addcolor.png);
		background-size: 100%;
	}
	.el-color-picker /deep/ .el-icon-close::before {
		content: "";
	}
}
</style>