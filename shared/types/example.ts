import {
  DSys,
  DSysGroupType,
  DSysLevel
} from "./designSystemTypes";
import { DTTokenType } from "./designTokenTypes";

const exampleDesignSystem: DSys = {
  $description: 'this is a design tokens sheet',
  scu : {// global prefix
    $extensions: {
      'dsys.level': DSysLevel.sheet,
      'dsys.prefix' : 'scu',
      'dsys.fullName': 'Summit Design System',
      'dsys.baseId': 'G:333',
    },
    colors: {
      $extensions: {
        'dsys.level': DSysLevel.group,
        'dsys.type': DSysGroupType.ColorSet,
        'dsys.nodeIds': ['S:243'],
      },
      $description: 'All the colors in this design system',
      primary: {
        $extensions: {
          'dsys.level': DSysLevel.tokenset,
          'dsys.type': DSysGroupType.ColorSet,
          'dsys.name': 'Primary',
          "dsys.nodeId": '3233'
        },
        $description: 'primary color set',
        '01': { // scu-colors-primary-01  >  scu-background-color-primary-01
          $extensions: {
            'dsys.level': DSysLevel.token,
            'dsys.name': '01',
          },
          $value: '#44444',
          $type: DTTokenType.color
        }
      }
    },
    typography: {
      $extensions: {
        'dsys.level': DSysLevel.group,
        'dsys.type': DSysGroupType.TypographySet,
        'dsys.nodeIds': ['S:25'],
      },
      'text' : {
        $extensions: {
          'dsys.level': DSysLevel.tokenset,
          'dsys.type': DSysGroupType.TypographySet,
          "dsys.name": 'Text',
          "dsys.nodeId": '3233'
        },
        '10': { // scu-typography-text-10  >  scu-text-10
          $extensions: {
            'dsys.level': DSysLevel.token,
            'dsys.name': '10',
          },
          $value: {
            fontFamily: 'dd',
            fontWeight: 'normal',
            fontSize: '12px',
          },
          $type: DTTokenType.typography
        }
      }
    },
    icons: {
      $extensions: {
        'dsys.level': DSysLevel.group,
        'dsys.type': DSysGroupType.IconSet,
        'dsys.nodeIds': ['S:241'],
      },
      'location' : {
        $extensions: {
          'dsys.level': DSysLevel.tokenset,
          'dsys.type': DSysGroupType.IconSet,
          "dsys.name": 'Text',
          "dsys.nodeId": '3233'
        },
        '' : { // scu-icons-location  >  scu-icon-location
          $extensions: {
            'dsys.level': DSysLevel.token,
            'dsys.name': '32',
          },
          $value: {
            url: 'url of svg',
            mime: 'svg',
          },
          $type: DTTokenType.file
        },
        /*'sizes' : {
          $extensions: {
            'dsys.level': DSysLevel.token,
            'dsys.name': '32',
          },
          $value: {
            sizes: ['32px','64px']
          },
          $type: DTTokenType.dimension
        }*/
      }
    },
    components: {
      $extensions: {
        'dsys.level': DSysLevel.group,
        'dsys.type': DSysGroupType.ComponentSet,
        'dsys.nodeIds': ['S:2443'],
      },
    },
    undetermined: {
      $extensions: {
        'dsys.level': DSysLevel.group,
        'dsys.type': DSysGroupType.Undetermined,
        'dsys.nodeIds': ['S:553'],
      },
      'undefined' : {
        $extensions: {
          "dsys.level": DSysLevel.tokenset,
          "dsys.type": DSysGroupType.Undetermined,
          "dsys.name": 'Undefined',
          "dsys.nodeId": '3233'
        }
      }
    },
  }
}