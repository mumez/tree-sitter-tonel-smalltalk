import sys
from setuptools import Extension, setup

if sys.platform == "win32":
    extra_compile_args = ["/std:c11"]
else:
    extra_compile_args = [
        "-std=c11",
        "-fvisibility=hidden",
        "-Wno-unused-parameter",
        "-Wno-unused-but-set-variable",
    ]

setup(
    ext_modules=[
        Extension(
            name="tree_sitter_tonel_smalltalk._binding",
            sources=[
                "bindings/python/tree_sitter_tonel_smalltalk/binding.c",
                "src/parser.c",
            ],
            extra_compile_args=extra_compile_args,
            include_dirs=["src"],
        )
    ],
    package_dir={"": "bindings/python"},
    packages=["tree_sitter_tonel_smalltalk"],
    package_data={"tree_sitter_tonel_smalltalk": ["*.pyi", "py.typed"]},
)
