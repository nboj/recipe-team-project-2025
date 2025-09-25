{
  description = "A basic flake with a shell";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.systems.url = "github:nix-systems/default";
  inputs.flake-utils = {
    url = "github:numtide/flake-utils";
    inputs.systems.follows = "systems";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        fhs = pkgs.buildFHSEnv {
          name = "pipezone";
          targetPkgs = pkgs: ([
            pkgs.bashInteractive 
            pkgs.python312
            pkgs.python312Packages.virtualenv
            pkgs.python312Packages.pip
          ]); 
          runScript = "zsh";
        };

      in
      {
        devShells.default = pkgs.mkShell {
          shellHook = ''
            if [ -z "\$\{IN_FHS_ENV-}" ]; then
              export IN_FHS_ENV=1
              export DIRENV_DISABLE=1
              exec ${fhs}/bin/${fhs.name}
            fi
          '';
        };
      }
    );
}
