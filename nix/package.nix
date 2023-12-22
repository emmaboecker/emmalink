{ mkPnpmPackage, inter, pkgs }:
  mkPnpmPackage {
    src = ../.;
    nodejs = pkgs.nodejs_20;
    distDir = ".next";

    SKIP_ENV_VALIDATION = true;
    SKIP_TYPECHECK = true;

    patches = [ ./patch-font.patch ];

    postPatch = ''
      substituteInPlace src/app/layout.tsx \
        --replace "%NIX_INTER%" ../../../../../${inter}/share/fonts/truetype/InterVariable.ttf
    '';

    preInstall = ''
      cp -r .next/static .next/standalone/.next/
      cp -r public .next/standalone/
    '';
  }