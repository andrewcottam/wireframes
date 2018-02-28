import * as React from 'react';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Badge from 'material-ui/Badge';
import { List, ListItem } from 'material-ui/List';
import { Tabs, Tab } from 'material-ui/Tabs';
import logo_slb from './logo-slb.png';
import logo_png from './logo-png.png';
import logo_tls from './logo-tls.png';
import logo_vut from './logo-vut.png';
import indicatorHistory from './indicatorHistory.png';
import { CardText } from 'material-ui/Card';
import CountryListItem from './CountryListItem.js';
import ProvinceListItem from './ProvinceListItem.js';

class IntactForestIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "Indicator" };
    }
    drillCountries() {
        this.setState({ value: 'Region' });
        this.props.map.setCenter([161.76, -8.14]);
        this.props.map.zoomTo(4);
    }
    drillCountry(e) {
        this.setState({ value: 'country', selectedCountry: e.countryListItem });
        this.props.map.fitBounds(e.countryListItem.props.bounds, {
            padding: { top: 50, bottom: 50, left: 600, right: 50 }
        });
    }
    drillProvince(e) {
        this.setState({ value: 'province', selectedProvince: e.provinceListItem });
        this.props.map.fitBounds(e.provinceListItem.props.bounds, {
            padding: { top: 50, bottom: 50, left: 600, right: 50 }
        });
    }
    render() {
        return (
            <React.Fragment>
              <Tabs        
                value={this.state.value}
                onChange={this.handleChange}
                >
                <Tab 
                  label="Indicator" 
                  value="Indicator" 
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                  {this.props.indicator ? 
                  <div
                    style={{padding:'12px',fontSize:'19px'}}>
                    {this.props.indicator.indicatorListItem.props.primaryText}
                  </div> : null }
                  <React.Fragment>
                  <div style={{textAlign:'center'}}>    
                    <Badge
                      badgeContent={4}
                      primary={true}
                      title="Click to show the countries in the region"
                      badgeStyle={{top: 25, right: 25, cursor :'pointer'}}
                      onClick={this.drillCountries.bind(this)}
                      >
                      <img 
                        src={indicatorHistory}
                        alt="Indicator history"
                      />
                    </Badge>
                  </div>
                  {this.props.indicator ?
                  <CardText 
                    style={{padding:'12px',fontSize:'13px'}}>{this.props.indicator.indicatorListItem.props.desc ? this.props.indicator.indicatorListItem.props.desc : "No description."}
                  </CardText>
                  : null}
                  </React.Fragment>
                </Tab>
                <Tab 
                  label="Region" 
                  value="Region"
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                  <List style={{padding:'0px'}}>
                    <CountryListItem 
                      primaryText="Papua New Guinea" 
                      secondaryText={
                          <span style={{fontSize: '11px'}}>1,647Km<span style={{verticalAlign: 'super',fontSize: '7px'}}>2</span></span>
                      }
                      leftAvatar={<Avatar src={logo_png} size={30} style={{top:"16px"}}/>}
                      drillCountry={this.drillCountry.bind(this)}
                      bounds={[140.8343505859375,-11.655380249023438,157.03778076171885,-0.7558330297469293]}
                    />
                    <CountryListItem
                      primaryText="Solomon Islands"
                      secondaryText={
                          <span style={{fontSize: '11px'}}>775Km<span style={{verticalAlign: 'super',fontSize: '7px'}}>2</span></span>
                      }
                      leftAvatar={<Avatar src={logo_slb} size={30} style={{top:"16px"}}/>}
                      drillCountry={this.drillCountry.bind(this)}
                      bounds={[155.3925018310548,-12.308334350585824,170.19250488281273,-4.44521999359124]}
                    />
                    <CountryListItem
                      primaryText="Timor Leste"
                      secondaryText={
                          <span style={{fontSize: '11px'}}>346Km<span style={{verticalAlign: 'super',fontSize: '7px'}}>2</span></span>
                      }
                      leftAvatar={<Avatar src={logo_tls} size={30} style={{top:"16px"}}/>}
                      drillCountry={this.drillCountry.bind(this)}
                      bounds={[124.04465484619152,-9.50465297698969,127.34249877929703,-8.126944541931156]}
                    />
                    <CountryListItem
                      primaryText="Vanuatu"
                      secondaryText={
                          <span style={{fontSize: '11px'}}>91Km<span style={{verticalAlign: 'super',fontSize: '7px'}}>2</span></span>
                      }
                      leftAvatar={<Avatar src={logo_vut} size={30} style={{top:"16px"}}/>}
                      drillCountry={this.drillCountry.bind(this)}
                      bounds={[166.54139709472656,-22.400554656982422,172.09008789062503,-13.072476387023903]}
                    />
                  </List>
                  <CardText 
                    style={{padding:'12px',fontSize:'13px'}}>Area of Intact Forest logged in the last 25 years.
                  </CardText>
                </Tab>
                <Tab 
                  label="Country"
                  value="country"
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                    {this.state.selectedCountry ? 
                      <React.Fragment>
                        <List style={{padding:'0px'}}>
                          <ListItem primaryText={this.state.selectedCountry.props.primaryText} secondaryText={this.state.selectedCountry.props.secondaryText} leftAvatar={this.state.selectedCountry.props.leftAvatar}  innerDivStyle={{padding:'16px 16px 16px 67px'}}/>
                        </List> 
                        <Divider />
                        <List>
                          <ProvinceListItem primaryText="Central" bounds={[146.38201904296886,-10.409167289733773,149.66452026367213,-7.7725348472595215]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Chimbu" bounds={[144.42181396484386,-6.868734836578312,145.35041809082034,-5.775935173034526]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="East New Britain" bounds={[150.594207763672,-6.07494401931757,152.49851989746108,-4.087428092956465]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="East Sepik" bounds={[141.33921813964844,-5.158234119415283,144.83367919921875,-3.1891660690306907]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Eastern Highlands" bounds={[144.98760986328125,-7.158435821533203,146.13621520996094,-5.852434158325202]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Enga" bounds={[142.74942016601585,-5.975834846496582,144.24871826171875,-5.010334014892511]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Gulf" bounds={[142.994110107422,-8.587371826171818,146.65251159667991,-6.7054347991942755]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Madang" bounds={[143.9691162109375,-5.996534824371338,147.21833801269554,-3.9902749061584326]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Manus" bounds={[142.8240509033203,-2.9321799278259277,148.20832824707034,-0.7558330297469982]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Milne Bay" bounds={[148.96670532226562,-11.655380249023438,154.39971923828136,-8.30111217498781]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Morobe" bounds={[145.74201965332054,-8.032334327697754,148.1841735839846,-5.280276775360104]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="New Ireland" bounds={[149.50520324707054,-4.851665019989014,154.75170898437503,-1.314795970916769]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="North Solomons" bounds={[154.09963989257824,-6.880917072296143,157.03778076171884,-4.355535984039303]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Northern" bounds={[147.004119873047,-9.97723388671875,149.44386291503915,-8.004035949706989]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Sandaun" bounds={[140.9997100830078,-5.378980159759408,143.09657287597693,-2.602708101272579]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Southern Highlands" bounds={[142.06697082519554,-6.8236351013183025,144.6881103515626,-4.941134929656986]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="West New Britain" bounds={[148.3077850341798,-6.325832843780461,151.69001770019528,-4.535143852233887]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Western" bounds={[140.8343505859375,-9.524073600769043,143.92416381835966,-4.987235069274884]} drillProvince={this.drillProvince.bind(this)}/>
                          <ProvinceListItem primaryText="Western Highlands" bounds={[143.7709197998047,-6.389835834503117,145.02641296386744,-5.218733787536607]} drillProvince={this.drillProvince.bind(this)}/>
                        </List>
                        <CardText 
                          style={{padding:'10px 0px 0px 11px',fontSize:'13px'}}>Area of Intact Forest logged in the last 25 years.
                        </CardText>
                      </React.Fragment>
                      : null}
                </Tab>
                <Tab 
                  label="Province"
                  value="province"
                  buttonStyle={{height:'25px',padding:'3px 0px 3px 0px'}}
                  style={{fontSize:'12px'}}
                  >
                    {this.state.selectedProvince ? 
                      <React.Fragment>
                        <List style={{padding:'0px'}}>
                          <ListItem primaryText={this.state.selectedCountry.props.primaryText} secondaryText={this.state.selectedCountry.props.secondaryText} leftAvatar={this.state.selectedCountry.props.leftAvatar}  innerDivStyle={{padding:'16px 16px 16px 67px'}}/>
                        </List> 
                        <Divider />
                        <List>
                          <ProvinceListItem primaryText={this.state.selectedProvince.props.primaryText} />
                        </List> 
                      </React.Fragment>
                      : null}
                </Tab>
              </Tabs>
            </React.Fragment>
        );
    }
}
export default IntactForestIndicator;
