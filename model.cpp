#include <cmath> 
class Model {
    public:
    constexpr static double pi = 3.14159265358979323846;
// for greeks true = call, false = put

    inline double getd1(double S, double K, double r, double t, double sig) {
        double d1 = (log(S/K) + (r + 0.5*(sig*sig * t)))/(sig * sqrt(t));
        return d1;
    }
    inline double getd2(double S, double K, double r, double t, double sig) {
        double d2 = getd1(S, K, r, t, sig) - sig * sqrt(t);
        return d2;
    }
    inline double getNPrime(double S, double K, double r, double t, double sig) {
        return (1/(2*pi)*exp(getd1(S, K, r, t, sig)*getd1(S, K, r, t, sig) / 2));
    }

    double getDelta(bool x, double S, double K, double r, double t, double sig) {
        if (x) {
            return normcdf(getd1(S, K, r, t, sig));
        }
        if (!x) {
            return normcdf(getd1(S, K, r, t, sig)) - 1;
        }
        return 0; // Default return for safety
    }

    double getGamma(double S, double K, double r, double t, double sig) {
        return 1/((S*sig)*sqrt(t)) * getNPrime(S, K, r, t, sig);
    }

    double getTheta(bool x, double S, double K, double r, double t, double sig) {
        double T = t * 365;
        if (x) {
            return (1/T)*(-((S*sig)/(2*sqrt(t))*getNPrime(S, K, r, t, sig) - r * K * normcdf(getd2(S, K, r, t, sig))));
        }
        if (!x) {
            return (1/T)*(-((S*sig)/(2*sqrt(t))*getNPrime(S, K, r, t, sig) + r * K * normcdf(-getd2(S, K, r, t, sig))));
        }
        return 0; // Default return for safety
    }   
    double getVega(double S, double K, double r, double t, double sig) {
        return (1/100)*S*sqrt(t)*getNPrime(S, K, r, t, sig);
    } 
    double getRho(bool x, double S, double K, double r, double t, double sig) {
        if (x) {
            return (1/100)*K*t*normcdf(getd2(S, K, r, t, sig));
        }
        if (!x) {
            return (1/100)*K*t*normcdf(-getd2(S, K, r, t,sig));
        }
        return 0; // Default return for safety
    }
    double getC(double S, double K, double r, double t, double sig) {
        return (S * normcdf(getd1(S, K, r, t, sig)) - K * exp(-r * t) * normcdf(getd2(S, K, r, t, sig)));
    }

    double normcdf(double x) {
        return 0.5 * (1 + erf(x / sqrt(2)));
    }

    double erf(double x) {
        double a1 = 0.254829592;
        double a2 = -0.284496736;
        double a3 = 1.421413741;
        double a4 = -1.453152027;
        double a5 = 1.061405429;
        double a6 = 0.3275911;
        double sign = 1;
        if (x < 0) {
            sign = -1;
        }
        x = abs(x);
        double t = 1 / (1 + a6 * x);
        double y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * exp(-x * x);  
        return sign * y;
        
    }

    double getP(double S, double K, double r, double t, double sig) {
        return (K * exp(-r * t) * normcdf(-getd2(S, K, r, t, sig)) - S * normcdf(-getd1(S, K, r, t, sig)));
    }
};

// Global instance
static Model* modelInstance = nullptr;

// Extern "C" functions to expose to JavaScript
extern "C" {

    double getC(double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getC(S, K, r, t, sig);
    }

    double normcdf(double x) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->normcdf(x);
    }

    double erf(double x) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->erf(x);
    }

    double getP(double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getP(S, K, r, t, sig);
    }

    double getd1(double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getd1(S, K, r, t, sig);
    }

    double getd2(double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getd2(S, K, r, t, sig);
    }
    double getNPrime(double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getNPrime(S, K, r, t, sig);
    }
    double getDelta(int x, double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getDelta(x != 0, S, K, r, t, sig);
    }
    double getGamma(double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getGamma(S, K, r, t, sig);
    }
    double getTheta(int x, double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getTheta(x != 0, S, K, r, t, sig);
    }
    double getVega(double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getVega(S, K, r, t, sig);
    }
    double getRho(int x, double S, double K, double r, double t, double sig) {
        if (!modelInstance) {
            modelInstance = new Model();
        }
        return modelInstance->getRho(x != 0, S, K, r, t, sig);
    }

    // Cleanup function
    void cleanup() {
        if (modelInstance) {
            delete modelInstance;
            modelInstance = nullptr;
        }
    }
}