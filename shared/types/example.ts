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
      'dsys.fullName': 'Summit Design Tokens',
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
            'dsys.index' : 0,
            'dsys.styleId' : 'sdfasdfasdfasdf',
          },
          $value: { // don't presume how alpha gets utilized...
            hex: '#444444',
            alpha: 0.5,
          },
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
            'dsys.index' : 0,
            'dsys.styleId' : 'sdfasdfasdfasdf',
          },
          $value: {
            fontFamily: 'FontFam',
            figmaFontObj: {
              family: 'FontFam',
              style: 'Normal',
            },
            fontWeight: 100,
            fontStyle: 'italic',
            fontSize: 12,
            letterSpacing: {
              value: 12,
              unit: 'PIXELS',
            },
            lineHeight: {
              unit:"AUTO"
            },
            listSpacing: 12,
            paragraphIndent: 12,
            paragraphSpacing: 12,
            textCase: "LOWER",
            textDecoration: "NONE"
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
            'dsys.index' : 0,
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
    spacing: {
      $extensions: {
        'dsys.level': DSysLevel.group,
        'dsys.type': DSysGroupType.Spacing,
        'dsys.nodeIds': ['S:2443'],
      },
      spacing: {
        $extensions: {
          'dsys.level': DSysLevel.tokenset,
          'dsys.type': DSysGroupType.Spacing,
          "dsys.name": 'spacing',
          "dsys.nodeId": 'S:4444'
        },
        $description: 'a set of spacing tokens',
        'spacing-l' : {
          $extensions: {
            'dsys.level': DSysLevel.token,
            "dsys.name": 'lg',
            "dsys.index": 1,
            "dsys.uid": 'safasdf',
          },
          $type: DTTokenType.spacing,
          $value: 20,
        },
        'spacing-xl' : {
          $extensions: {
            'dsys.level': DSysLevel.token,
            "dsys.name": 'xl',
            "dsys.index": 0,
            "dsys.uid": 'asdfasfasdfasdf'
          },
          $type: DTTokenType.spacing,
          $value: 30,
        }
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

export default exampleDesignSystem;
