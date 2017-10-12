export default {
    'Built-In - Tresillo': {
        'idCounter': 23,
        'wires': [
            {
                'id': 5,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 1,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 2,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 6,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 2,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 3,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 7,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 3,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 1,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 12,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 2,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 9,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 16,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 1,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 9,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 17,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 3,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 9,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 22,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 21,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 2,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'gate': false
            }
        ],
        'blocks': [
            {
                'id': 1,
                'kind': 'block',
                'name': 'Delay',
                'active': true,
                'x': 342,
                'y': 162,
                'ports': {
                    'Top': 'out',
                    'Right': 'out',
                    'Bottom': 'in',
                    'Left': 'in'
                },
                'beats': 3,
                'noteFraction': 8
            },
            {
                'id': 2,
                'kind': 'block',
                'name': 'Delay',
                'active': true,
                'x': 414,
                'y': 162,
                'ports': {
                    'Top': 'out',
                    'Right': 'out',
                    'Bottom': 'in',
                    'Left': 'in'
                },
                'beats': 3,
                'noteFraction': 8
            },
            {
                'id': 3,
                'kind': 'block',
                'name': 'Delay',
                'active': true,
                'x': 486,
                'y': 162,
                'ports': {
                    'Top': 'out',
                    'Right': 'in',
                    'Bottom': 'out',
                    'Left': 'in'
                },
                'beats': 1,
                'noteFraction': 4
            },
            {
                'id': 9,
                'kind': 'block',
                'name': 'MidiOut',
                'active': true,
                'x': 414,
                'y': 90,
                'ports': {
                    'Top': 'out',
                    'Right': 'in',
                    'Bottom': 'in',
                    'Left': 'in'
                },
                'channel': 1,
                'note': 36,
                'velocity': 100
            },
            {
                'id': 21,
                'kind': 'block',
                'name': 'Play',
                'active': true,
                'x': 414,
                'y': 234,
                'ports': {
                    'Top': 'out',
                    'Right': 'out',
                    'Bottom': 'out',
                    'Left': 'out'
                }
            }
        ],
        'viewportOffset': {
            'x': 18,
            'y': 72
        },
        'bpm': 130
    },
    'Built-In - 2 over 3': {
        'idCounter': 22,
        'wires': [
            {
                'id': 4,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 1,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 3,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 5,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 2,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 3,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 9,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 1,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 2,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 10,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 2,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 1,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 12,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 0,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 1,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 13,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 7,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 6,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 14,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 6,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 8,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 16,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 7,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 15,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 17,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 6,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 15,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 18,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 8,
                    'port': {
                        'x': 22,
                        'y': 49,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 2,
                            'x': 0,
                            'y': 1,
                            'name': 'Bottom'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 15,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 19,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 8,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 7,
                    'port': {
                        'x': 22,
                        'y': -1,
                        'width': 6,
                        'height': 2,
                        'side': {
                            'index': 0,
                            'x': 0,
                            'y': -1,
                            'name': 'Top'
                        }
                    }
                },
                'gate': false
            },
            {
                'id': 21,
                'kind': 'wire',
                'active': true,
                'startPortInfo': {
                    'blockId': 0,
                    'port': {
                        'x': 49,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 1,
                            'x': 1,
                            'y': 0,
                            'name': 'Right'
                        }
                    }
                },
                'endPortInfo': {
                    'blockId': 7,
                    'port': {
                        'x': -1,
                        'y': 23,
                        'width': 2,
                        'height': 6,
                        'side': {
                            'index': 3,
                            'x': -1,
                            'y': 0,
                            'name': 'Left'
                        }
                    }
                },
                'gate': false
            }
        ],
        'blocks': [
            {
                'id': 0,
                'kind': 'block',
                'name': 'Play',
                'active': true,
                'x': 342,
                'y': 198,
                'ports': {
                    'Top': 'out',
                    'Right': 'out',
                    'Bottom': 'out',
                    'Left': 'out'
                }
            },
            {
                'id': 1,
                'kind': 'block',
                'name': 'Delay',
                'active': true,
                'x': 450,
                'y': 162,
                'ports': {
                    'Top': 'out',
                    'Right': 'out',
                    'Bottom': 'in',
                    'Left': 'in'
                },
                'beats': 1,
                'noteFraction': 2
            },
            {
                'id': 2,
                'kind': 'block',
                'name': 'Delay',
                'active': true,
                'x': 522,
                'y': 162,
                'ports': {
                    'Top': 'out',
                    'Right': 'out',
                    'Bottom': 'out',
                    'Left': 'in'
                },
                'beats': 1,
                'noteFraction': 2
            },
            {
                'id': 3,
                'kind': 'block',
                'name': 'MidiOut',
                'active': true,
                'x': 486,
                'y': 90,
                'ports': {
                    'Top': 'out',
                    'Right': 'in',
                    'Bottom': 'out',
                    'Left': 'in'
                },
                'channel': 1,
                'note': 36,
                'velocity': 100
            },
            {
                'id': 6,
                'kind': 'block',
                'name': 'Delay',
                'active': true,
                'x': 486,
                'y': 252,
                'ports': {
                    'Top': 'out',
                    'Right': 'out',
                    'Bottom': 'out',
                    'Left': 'in'
                },
                'beats': 1,
                'noteFraction': 3
            },
            {
                'id': 7,
                'kind': 'block',
                'name': 'Delay',
                'active': true,
                'x': 414,
                'y': 252,
                'ports': {
                    'Top': 'in',
                    'Right': 'out',
                    'Bottom': 'out',
                    'Left': 'in'
                },
                'beats': 1,
                'noteFraction': 3
            },
            {
                'id': 8,
                'kind': 'block',
                'name': 'Delay',
                'active': true,
                'x': 558,
                'y': 252,
                'ports': {
                    'Top': 'out',
                    'Right': 'out',
                    'Bottom': 'out',
                    'Left': 'in'
                },
                'beats': 1,
                'noteFraction': 3
            },
            {
                'id': 15,
                'kind': 'block',
                'name': 'MidiOut',
                'active': true,
                'x': 486,
                'y': 324,
                'ports': {
                    'Top': 'in',
                    'Right': 'in',
                    'Bottom': 'out',
                    'Left': 'in'
                },
                'channel': 1,
                'note': 37,
                'velocity': 100
            }
        ],
        'viewportOffset': {
            'x': -36,
            'y': 36
        },
        'bpm': 130
    },
};
